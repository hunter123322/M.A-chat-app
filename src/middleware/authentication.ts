import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JTWRefreshToken, JWTPayload } from "../types/jtw.payload.type";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh-secret";

const JWT_EXPIRES_IN = 60 * 15;
const REFRESH_EXPIRES_IN = 60 * 60 * 24 * 7 * 30 * 3;

// Extend Express Request type to include user
type AuthRequest = Request & {
  user?: JWTPayload;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1] || req.cookies?.JWTToken;

  if (!token) {
    res.status(401).json({ message: "Access token required" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
    return;
  }
};


export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const generateRefreshToken = (payload: JTWRefreshToken): string => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
};
