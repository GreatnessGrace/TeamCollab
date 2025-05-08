import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { Team } from "../models/team.model";
import { generateInviteToken } from "../utils/jwt";
import { sendEmail } from "../utils/sendEmail";


export const create = async (req: AuthenticatedRequest, res: Response) => {
    try {
    const { name } = req.body;
    const userId =  req?.user?.userId;

    const existing = await Team.findOne({ name });
    if (existing) return res.status(409).json({ message: 'Team name already in use' });

    const team = await Team.create({ name, createdBy: userId, members: [{ user: userId, role: 'manager' }]
    });
    res.status(201).json({ message: 'Team created successfully', team})

}
catch (error) {
    res.status(500).json({ message: 'Server error', error });
}
}

export const inviteUserToTeam = async (req: Request, res: Response) => {
    try {
      const { email, role } = req.body;
      const { teamId } = req.params;
  console.log(teamId)
      const token = generateInviteToken(email, teamId);
  
      const team = await Team.findById(teamId);
      if (!team) return res.status(404).json({ message: 'Team not found' });
  
      team.inviteTokens.push({
        email,
        token,
        expiresAt: new Date(Date.now() + 2 * 86400000), // 2 days
      });
      await team.save();
  
      const inviteLink = `https://frontend.com/join?token=${token}`;
  
      await sendEmail(
        email,
        'Team Invite - TeamCollab',
        `<p>You have been invited to join <strong>${team.name}</strong> as <strong>${role}</strong>.</p>
         <p><a href="${inviteLink}">Click here to join</a></p>
         <p>This link will expire in 2 days.</p>`
      );
  
      res.status(200).json({ message: `Invitation sent to ${email}` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error });
    }
  };