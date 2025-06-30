import express, { Request, Response } from "express";
import passwordController from "../controller/passwordController.js";
import mysqlConnect from "../controller/mySQLConnection.js";
import path from "path";
import { fileURLToPath } from "url";
import userSignupValidation from "../model/userSignupValidation.js";
import { ResultSetHeader } from "mysql2";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sqlconnection = await mysqlConnect();

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

async function getSingup(req: Request, res: Response): Promise<void> {
  try {
    res.sendFile(path.join(__dirname, "../../public/html/login-signup.html"));
  } catch (error) {
    res.status(500);
  }
}

async function getSingupInformation(req: Request, res: Response): Promise<void> {
  try {
    res.sendFile(path.join(__dirname, "../../public/html/userInfo.html"));
  } catch (error) {
    res.status(500);
  }
}

async function getSingupLocation(req: Request, res: Response): Promise<void> {
  try {
    res.sendFile(path.join(__dirname, "../../public/html/userLocation.html"));
  } catch (error) {
    res.status(500);
  }
}

async function postSignup(req: Request, res: Response): Promise<void> {
  try {
    const userAut: UserAut = req.body;

    if (!userAut) throw new Error();

    await sqlconnection.beginTransaction();

    const username: string = userAut.username;
    const hashedPassword: string = await passwordController.passwordHasher(userAut.password);

    const userAutQuery = `INSERT INTO login_info (username, password) VALUES (?, ?)`;
    const [result] = await sqlconnection.execute<ResultSetHeader>(userAutQuery, [username, hashedPassword]);

    await sqlconnection.commit();

    const user_id = result.insertId;
    (req.session as { user_id?: number }).user_id = user_id;

    res.status(200).json({ message: "aceepted" });
  } catch (error: any) {
    await sqlconnection.rollback();
    console.error("Error during signup:", error);
    res.status(500).json({ error: error.message });
  }
}

async function userInformation(req: Request, res: Response): Promise<void> {
  try {
    const userInfo: UserInfo = req.body;
    userInfo.age = Number(userInfo.age)

    userSignupValidation.userValidation(userInfo);

    if (!userInfo.middleName) userInfo.middleName = "";

    const user_id = (req.session as { user_id?: number }).user_id;
    if (!user_id) throw new Error("No user session");
    console.log(user_id)

    await sqlconnection.beginTransaction();

    const userInfoQuery: string =
      "INSERT INTO users (user_id, firstName, lastName, middleName, age) VALUES (?, ?, ?, ?, ?)";

    const [result] = await sqlconnection.execute<ResultSetHeader>(userInfoQuery, [
      user_id,
      userInfo.firstName,
      userInfo.lastName,
      userInfo.middleName,
      userInfo.age,
    ]);

    if ((result as ResultSetHeader).affectedRows === 0) {
      throw new Error("Insert failed");
    }

    await sqlconnection.commit();

    res.status(200).json({ message: "aceepted" });
  } catch (error: any) {
    await sqlconnection.rollback()
    res.status(500).json({ message: "Server error please try again" });
    console.log(error);

  }
}

async function userLocation(req: Request, res: Response): Promise<void> {
  try {
    const userLoc: UserLocation = req.body;
    userSignupValidation.locationValidation(userLoc);

    const user_id = (req.session as { user_id?: number }).user_id;
    if (!user_id) throw new Error("No user session");

    await sqlconnection.beginTransaction();

    const locationQuery: string =
      "INSERT INTO location (user_id, country, region, district, municipality, barangay, zone, house_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const [result] = await sqlconnection.execute<ResultSetHeader>(locationQuery, [
      user_id,
      userLoc.country,
      userLoc.region,
      userLoc.district,
      userLoc.municipality,
      userLoc.barangay,
      userLoc.zone,
      userLoc.house_number,
    ]);

    await sqlconnection.commit();

    res.status(200).json({ message: "Signup successful", redirectUrl: "/socket/v1" });
  } catch (error) {
    await sqlconnection.rollback();
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
