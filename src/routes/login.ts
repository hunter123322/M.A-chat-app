import { Request, Response } from "express";
import passwordController from "../controller/passwordController";
import validation from "../model/user";
import mysqlConnect from "../controller/mySQLConnection";

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

// login routes
const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const user: UserAut = req.body;

    const comparePassword = await passwordController.compareIncryptedPassword(user.username, user.password);
    if (comparePassword !== true) throw new Error();

    (req.session as { username?: string }).username = user.username;

    res.status(200);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// signup routes
const signup = async (req: Request, res: Response): Promise<void> => {
  const sqlconnection = await mysqlConnect();
  const queryRunner = await sqlconnection.bigTransaction();

  try {
    const userInfo: UserInfo & UserAut & UserLocation = req.body;
    if (!userInfo.middleName) userInfo.middleName = "";
    validation.userValidation(userInfo.firstName, userInfo.lastName, userInfo.middleName, userInfo.age);
    validation.locationValidation(
      userInfo.country,
      userInfo.region,
      userInfo.district,
      userInfo.municipality,
      userInfo.barangay,
      userInfo.zone,
      userInfo.house_number
    );

    // initialize username and hashed password
    const username: string = userInfo.username;
    const hashedPassword: string = await passwordController.passwordHasher(userInfo.password);

    // Prepare queries
    const userInfoQuery: string = `INSERT INTO users (firstName, lastName, middleName, age) VALUES (?, ?, ?, ?)`;
    await queryRunner.execute(userInfoQuery, [
      userInfo.firstName,
      userInfo.lastName,
      userInfo.middleName,
      userInfo.age,
    ]);

    const userAutQuery: string = `INSERT INTO login_info (username, password) VALUES (?, ?)`;
    await queryRunner.execute(userAutQuery, [userInfo.username, hashedPassword]);

    const locationQuery: string = `INSERT INTO location (country, region, district, municipality, barangay, zone, house_number) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    await queryRunner.execute(locationQuery, [
      userInfo.country,
      userInfo.region,
      userInfo.district,
      userInfo.municipality,
      userInfo.barangay,
      userInfo.zone,
      userInfo.house_number,
    ]);
    await queryRunner.commitTransaction();

    (req.session as { username?: string }).username = username;

    res.status(201).json({ message: "Successfully sign up!" });
  } catch (error: any) {
    await queryRunner.rollbackTransaction();
    res.status(500).json({ error: error.message });
  } finally {
    await queryRunner.release();
  }
};
