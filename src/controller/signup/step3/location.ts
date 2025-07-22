import { Request, Response } from "express";
import mySQLConnectionPool from "../../../db/mysql/mysql.connection-pool.js";
import path from "path";
import { fileURLToPath } from "url";
import { UserController } from "../../user.controller.js";
import type { UserLocation } from "../../../types/User.type.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Handle get location
export async function getLocation(req: Request, res: Response): Promise<void> {
  try {
    res.sendFile(path.join(__dirname, "../../../public/html/userLocation.html"));
  } catch (error) {
    res.status(500);
  }
}

// Handle post location
export async function postLocation(req: Request, res: Response): Promise<void> {
  const userController = new UserController(mySQLConnectionPool)
  try {
    const userLoc: UserLocation = req.body;
    const user_id = (req.session as { user_id?: number }).user_id;
    if (!user_id) throw new Error("No user session");
    userController.locationController(userLoc, user_id)
    res.status(200).json({ message: "Signup successful", redirectUrl: "/socket/v1" });
  } catch (error) {
    res.status(500).json({ message: "Server error, please try again" });
  }
}