import { Request, Response } from "express";
import mySQLConnectionPool from "../../../db/mysql/mysql.connection-pool.js";
import { UserController } from "../../user.controller.js";
import type { UserAut } from "../../../types/User.type.js";

// Handle post signup
export async function postSignup(req: Request, res: Response): Promise<void> {
  const userController = new UserController(mySQLConnectionPool)
  try {
    const userAut: UserAut = req.body;
    console.log(userAut)
    if (!userAut) throw new Error("Try it again");
    const user_id = await userController.signController(userAut.username, userAut.password);
    (req.session as { user_id?: number }).user_id = user_id;
    res.status(200).json({ message: "aceepted", user_id: user_id });
  } catch (error: any) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: error.message });
  }
}
