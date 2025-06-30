import bcrypt from "bcrypt";
import mysqlConnect from "./mySQLConnection.js";

const saltRound = 5;

interface UserAut {
  user_id: string;
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

async function compareIncryptedPassword(username: string, password: string): Promise<UserAut> {
  const sqlconnection = await mysqlConnect();
  try {
    const rows: any = await sqlconnection.query("SELECT * FROM login_info WHERE username = ?", [username]);    
    if (rows[0].length === 0) throw new Error("Username not fond!");

    const user = rows[0][0];

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) throw new Error("Incorrect password!");

    return user;
  } catch (error) {
    throw error;
  }
}

export default { passwordHasher, compareIncryptedPassword };
