import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const REFERSH_SECRET = process.env.REFRESH_SECRET!;

export const signAccessToken = (payload: object) => jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });

export const signRefreshToken = (payload: object) => jwt.sign(payload, REFERSH_SECRET, { expiresIn: '7d' });

export const verifyToken = (token: string, type: 'access' | 'refresh') => jwt.verify(token, type === 'access' ? JWT_SECRET : REFERSH_SECRET);