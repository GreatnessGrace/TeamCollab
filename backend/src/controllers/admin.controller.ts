import { Response } from "express";
import { AuthenticatedRequest, checkRole } from "../middlewares/auth.middleware";
import { User } from "../models/user.model";

export const createAdmin = async (req: AuthenticatedRequest, res: Response) => {

    const {  name , email, password } = req.body;

    const existing = await User.findOne({ email });

    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const admin = await User.create({ name, email, password, role: 'admin' });

    res.status(201).json({ message: 'Admin created', admin: { id: admin._id, email: admin.email } });

}