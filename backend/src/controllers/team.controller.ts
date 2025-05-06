import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { Team } from "../models/team.model";


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