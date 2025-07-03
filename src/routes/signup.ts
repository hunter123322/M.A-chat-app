import express, { Request, Response } from "express";
import passwordController from "../controller/passwordController.js";
import mySQLConnectionPool from "../controller/mySQLConnectionPool.js";
import path from "path";
import { fileURLToPath } from "url";
import userSignupValidation from "../model/userSignupValidation.js";
import { ResultSetHeader } from "mysql2";

// refactor
import { UserController } from "../controller/userController.js";


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SQLconnection = await mySQLConnectionPool.getConnection();

interface UserAut {
  username: string;
  password: string;
}

interface UserInfo {
  firstName: string;
  lastName: string;
  middleName: string;
  age: number;
}

interface UserLocation {
  country: string;
  region: string;
  district: string;
  municipality: string;
  barangay: string;
  zone: string;
  house_number: string;
}

app.use(express.static("public"));
app.use(express.json()); // For parsing JSON payloads
app.use(express.urlencoded({ extended: true })); // For form data

// Handle get signUP
async function getSingup(req: Request, res: Response): Promise<void> {
  try {
    res.sendFile(path.join(__dirname, "../../public/html/login-signup.html"));
  } catch (error) {
    res.status(500);
  }
}

// Handle get information
async function getSingupInformation(req: Request, res: Response): Promise<void> {
  try {
    res.sendFile(path.join(__dirname, "../../public/html/userInfo.html"));
  } catch (error) {
    res.status(500);
  }
}

// Handle get location
async function getSingupLocation(req: Request, res: Response): Promise<void> {
  try {
    res.sendFile(path.join(__dirname, "../../public/html/userLocation.html"));
  } catch (error) {
    res.status(500);
  }
}

// Handle post signup
async function postSignup(req: Request, res: Response): Promise<void> {
  const userController = new UserController(mySQLConnectionPool)
  try {
    const userAut: UserAut = req.body;
    if (!userAut) throw new Error();

    const user_id = await userController.signController(userAut.username, userAut.password);
    (req.session as { user_id?: number }).user_id = user_id;
    res.status(200).json({ message: "aceepted", user_id: user_id });
  } catch (error: any) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: error.message });
  }
}

// Handle post information
async function userInformation(req: Request, res: Response): Promise<void> {
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

// Handle post location
async function userLocation(req: Request, res: Response): Promise<void> {
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

export default {
  getSingup,
  getSingupInformation,
  getSingupLocation,
  postSignup,
  userInformation,
  userLocation,
};
