import { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import mySQLConnectionPool from "../controller/mySQLConnectionPool.js";
import { UserController } from "../controller/userController.js";

const User = new UserController(mySQLConnectionPool);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface UserAut {
  user_id: number;
  username: string;
  password: string;
}

/**
 * 
 * @function Get login
 * 
 */
async function getLogin(req: Request, res: Response): Promise<void> {
  try {
    res.sendFile(path.join(__dirname, "../../public/html/login-signup.html"));
  } catch (error) {
    res.status(500);
  }
}

/**
 * Handles a request containing user data and returns a structured response.
 *
 * @param req - The request object, expected to contain the following userData keys:
 *              - user_id: number
 *              - username: string
 *              - password: string
 *
 * @data data - The response object, which will return an array of structured objects.
 *
 * data format (Array<object>):
 * [
 *   {
 *     user_id: number,
 *     message: Array<object>
 *   },
 *   {
 *     authentication: object
 *   }
 * ]
 */
async function postlogin(req: Request, res: Response): Promise<void> {
  const sqlconnection = await mySQLConnectionPool.getConnection();
  try {
    const userData: UserAut = req.body;
    const data = await User.loginController(userData);
    
    (req.session as { user_id?: number }).user_id = data[0].user_id;
    res.status(200)
      .json({ message: "Login successful", user_id: data[0].user_id, messages: data[0].messages, userInfo: data[1].authentication });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
    console.log(error)
  }
}


export default { postlogin, getLogin };
