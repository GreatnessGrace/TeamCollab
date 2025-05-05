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


export const login = async (req:Request, res:Response) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if(!user) return res.status(401).json({ message: 'Invalid email or password' });

        const isMatch = await comparePasswords(password, user.password)

        const payload = { userId: user._id, role: user.role };
        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken(payload)

        res.cookie('refershToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ accessToken })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}