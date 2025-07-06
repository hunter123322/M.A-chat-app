import bcrypt from "bcrypt";
import mySQLConnectionPool from "../../db/mysql/mysql.connection-pool.js";
import { RowDataPacket } from 'mysql2/promise';
import { UserModel } from "../../model/user/user.model.js";


const saltRound = 5;

interface UserAut {
  user_id: number;
  username: string;
  password: string;
}

interface UserInfo {
  firstName: string;
  lastName: string;
  middleName: string;
  age: number;
}

type UserAuthFull = UserAut & UserInfo;

async function passwordHasher(password: string): Promise<string> {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRound);
    return hashedPassword;
  } catch (error) {
    throw new Error("Canot encrypt the passwords");
  }
}

async function compareEncryptedPassword<TData>(
  username: string,
  password: string
): Promise<UserAuthFull> {
  const connection = await mySQLConnectionPool.getConnection();
  const initUserInfo = new UserModel(mySQLConnectionPool);
  try {
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM users_auth WHERE username = ?",
      [username]
    );

    if (!rows || rows.length === 0) {
      throw new Error("Username not found!");
    }

    const user = rows[0] as UserAut;
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Incorrect password!");
    }

    const userInfo = await initUserInfo.initUserInfo(user.user_id);
    const returnValue = { ...user, ...userInfo } as UserAuthFull;

    return returnValue;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}


export default { passwordHasher, compareEncryptedPassword };
