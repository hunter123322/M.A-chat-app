import bcrypt from "bcrypt";
import mySQLConnectionPool from "./mySQLConnectionPool.js";
import { RowDataPacket } from 'mysql2/promise';


const saltRound = 5;

interface UserAut {
  user_id: number;
  username: string;
  password: string;
}

async function passwordHasher(password: string): Promise<string> {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRound);
    return hashedPassword;
  } catch (error) {
    throw new Error("Canot encrypt the passwords");
  }
}

async function compareEncryptedPassword(username: string, password: string): Promise<UserAut> {
  const connection = await mySQLConnectionPool.getConnection();
  try {
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM login_info WHERE username = ?",
      [username]
    );

    if (!rows || rows.length === 0) {
      throw new Error("Username not found!");
    }

    const user = rows[0] as UserAut; // Cast to your UserAut type
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Incorrect password!");
    }

    return user;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export default { passwordHasher, compareEncryptedPassword };
