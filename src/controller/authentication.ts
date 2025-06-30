import { Request, Response, NextFunction } from "express";

async function isAuthenticated(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    // Check if the session has the `username` field set
    if (req.session && (req.session as { user_id?: string }).user_id) {
      return next(); // Proceed to the next middleware or route handler
    }

    // If no username is found, send a 401 Unauthorized error
    return res.status(401).json({ message: "Unauthorized - Please login first" });
  } catch (error) {
    console.error("Authentication Error: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export default isAuthenticated;
