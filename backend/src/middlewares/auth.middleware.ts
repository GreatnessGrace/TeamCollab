import { Request, Response, NextFunction, RequestHandler } from "express";
import { verifyToken } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: "admin" | "manager" | "user";
  };
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "No token" });
    return;
  }
  try {
    const payload = verifyToken(token, "access") as any;
    req.user = payload; // attach user info to request
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const checkRole = (role: string): RequestHandler => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (req.user?.role !== role) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }
    next();
  };
};
