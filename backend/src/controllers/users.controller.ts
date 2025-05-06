import { Request, Response } from "express";
import { User } from "../models/user.model";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
    const user = await User.findById(req.user?.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
  
    res.json(user);
  };
  