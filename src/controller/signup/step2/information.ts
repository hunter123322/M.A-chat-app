import { Request, Response } from "express";
import mySQLConnectionPool from "../../../db/mysql/mySQLConnectionPool.js";
import path from "path";
import { fileURLToPath } from "url";
import { UserController } from "../../userController";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface UserInfo {
  firstName: string;
  lastName: string;
  middleName: string;
  age: number;
}

// Handle get information
export async function getInformation(req: Request, res: Response): Promise<void> {
  try {
    res.sendFile(path.join(__dirname, "../../public/html/userInfo.html"));
  } catch (error) {
    res.status(500);
  }
}

// Handle post information
export async function postInformation(req: Request, res: Response): Promise<void> {
  const userController = new UserController(mySQLConnectionPool)
  try {
    const userInfo: UserInfo = req.body;
    userInfo.age = Number(userInfo.age)
    if (!userInfo.middleName) userInfo.middleName = "";
    const user_id = (req.session as { user_id?: number }).user_id;
    if (!user_id) throw new Error("No user session");
    userController.userInformationController(userInfo, user_id)
    res.status(200).json({ message: "aceepted" });
  } catch (error: any) {
    res.status(500).json({ message: "Server error please try again" });
    console.log(error);

  }
}