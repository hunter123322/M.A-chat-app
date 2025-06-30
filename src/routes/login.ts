import { Request, Response } from "express";
import passwordController from "../controller/passwordController.js";
import path from "path";
import { fileURLToPath } from "url";
import mysqlConnection from "../controller/mySQLConnection.js";
import Message from "../model/messagesModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface UserAut {
  user_id?: string;
  username: string;
  password: string;
}

// login route
async function getLogin(req: Request, res: Response): Promise<void> {
  try {
    res.sendFile(path.join(__dirname, "../../public/html/login-signup.html"));
  } catch (error) {
    res.status(500);
  }
}

async function postlogin(req: Request, res: Response): Promise<void> {
  const sqlconnection = await mysqlConnection();
  try {
    const user: UserAut = req.body;

    const authentication: UserAut = await passwordController.compareIncryptedPassword(user.username, user.password);

    if (!authentication) {
      throw new Error("Invalid Login!");
    }

    (req.session as { user_id?: string }).user_id = authentication.user_id;

    const sendedMessage = await Message.find({ senderID: authentication.user_id })
      .sort({ createdAt: -1 })
      .limit(20);

    const receiveMessage = await Message.find({ receiverID: authentication.user_id })
      .sort({ createdAt: -1 })
      .limit(20);

    const message: any = sendedMessage.concat(receiveMessage);
    message.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    console.log(message);
    

    res.status(200)
      .json({ message: "Login successful", user_id: authentication.user_id, messages: message });
  } catch (error: any) {
    await sqlconnection.rollback();
    res.status(404).json({ error: error.message });
    console.log(error)
  } finally {
    sqlconnection.end();
  }
}


export default { postlogin, getLogin };
