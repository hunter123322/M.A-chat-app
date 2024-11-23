import { Request, Response, NextFunction } from "express";

async function isAuthenticated(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
  try {
    if (req.session && (req.session as { username?: string }).username) {
      return next();
    }
    return res.status(401).json({ message: "Unauthorized" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
