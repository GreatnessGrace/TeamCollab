import { Request, Response } from "express";
import { User } from "../models/user.model";
import { comparePasswords } from "../utils/password";
import { signAccessToken, signRefreshToken } from "../utils/jwt";


export const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const user = await User.create({ name, email, password });
    res.status(201).json({ message: 'User Registered', user: { id: user._id, name: user.name, email: user.email }})
};
