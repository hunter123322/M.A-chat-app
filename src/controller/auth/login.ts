import { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import mySQLConnectionPool from "../../db/mysql/mysql.connection-pool.js";
import { UserController } from "../user.controller.js";
import type { UserAut } from "../../types/User.type.js";


const User = new UserController(mySQLConnectionPool);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getLogin(req: Request, res: Response): Promise<void> {
  try {
    res.sendFile(path.join(__dirname, "../../../public/html/login-signup.html"));
  } catch (error) {
    res.status(500);
  }
}

async function postLogin(req: Request, res: Response): Promise<void> {
  try {
    const userData: UserAut = req.body;
    const data = await User.loginController(userData);

    (req.session as { user_id?: number }).user_id = data.user_id;
    res.status(200)
      .json({ message: "Login successful", user_id: data.user_id, messages: data.messages, userInfo: data.authentication });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
    console.log(error)
  }
}

export { postLogin, getLogin };
