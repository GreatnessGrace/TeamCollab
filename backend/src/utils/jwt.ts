import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;
const REFERSH_SECRET = process.env.REFRESH_SECRET!;

export const signAccessToken = (payload: object) => jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });

export const signRefreshToken = (payload: object) => jwt.sign(payload, REFERSH_SECRET, { expiresIn: '7d' });

export const verifyToken = (token: string, type: 'access' | 'refresh') => jwt.verify(token, type === 'access' ? JWT_SECRET : REFERSH_SECRET);

export const generateInviteToken = (email: string, teamId: string): string => {
    return jwt.sign({ email, teamId }, process.env.INVITE_SECRET!, { expiresIn: '2d' });
  }
  
export const verifyInviteToken = (token: string) => {
    return jwt.verify(token, process.env.INVITE_SECRET!);
  }
  