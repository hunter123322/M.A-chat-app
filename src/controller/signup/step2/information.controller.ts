import { Request, Response } from "express";
import mySQLConnectionPool from "../../../db/mysql/mysql.connection-pool.js";
import { UserController } from "../../user.controller.js";
import type { UserInfo } from "../../../types/User.type.js";

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