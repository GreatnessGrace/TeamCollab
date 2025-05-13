import { Request, Response } from "express";
import { User } from "../models/user.model";
import { comparePasswords } from "../utils/password";
import { signAccessToken, signRefreshToken, verifyToken } from "../utils/jwt";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409).json({ message: "Email already in use" });
    return;
  }

  const user = await User.create({ name, email, password });
  res
    .status(201)
    .json({
      message: "User Registered",
      user: { id: user._id, name: user.name, email: user.email },
    });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user: any = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const isMatch: boolean = await comparePasswords(password, user.password);

    const payload = { userId: user._id, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    res.cookie("refershToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = req.cookies.refershToken;
    if (!token) {
      res.status(401).json({ message: "Refresh token missing" });
      return;
    }

    const decoded = verifyToken(token, "refresh") as {
      userId: string;
      role: string;
    };

    const accessToken = signAccessToken({
      userId: decoded.userId,
      role: decoded.role,
    });

    res.json({ accessToken });
    return;
  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(401).json({ message: "Invalid refresh token" });
    return;
  }
};
