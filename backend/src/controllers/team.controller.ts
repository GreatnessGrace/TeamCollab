import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { Team } from "../models/team.model";
import { generateInviteToken, verifyInviteToken } from "../utils/jwt";
import { sendEmail } from "../utils/sendEmail";
import { User } from "../models/user.model";


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

  export const joinTeam = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const decoded = verifyInviteToken(token) as { email: string; teamId: string };
  
      const team = await Team.findById(decoded.teamId);
      if (!team) return res.status(404).json({ message: 'Team not found' });
  
      const invite = team.inviteTokens.find(i => i.token === token);
      if (!invite) return res.status(403).json({ message: 'Invalid invite token' });
  console.log(decoded.email)
      const user = await User.findOne({ email: decoded.email });
      if (!user) return res.status(404).json({ message: 'User not registered yet' });
  
      // Add to team if not already a member
      const alreadyMember = team.members.some(m => m?.user?.toString() === user._id.toString());
      if (!alreadyMember) {
        team.members.push({ user: user._id, role: 'user' });
        await team.save();
  
        user.teams.push(team._id);
        await user.save();
      }
  
      res.status(200).json({ message: 'Joined team successfully', teamId: team._id });
    } catch (error) {
      res.status(400).json({ message: 'Invalid or expired token', error });
    }
  };

  export const listTeamMembers = async (req: Request, res: Response) => {
    try {
      const { teamId } = req.params;
  
      const team = await Team.findById(teamId).populate('members.user', 'name email');
      if (!team) return res.status(404).json({ message: 'Team not found' });
  
      res.status(200).json({
        teamId: team._id,
        members: team.members
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };