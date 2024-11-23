import bcrypt from "bcrypt";
import mysqlConnect from "./mySQLConnection";

const saltRound = 5;

async function passwordHasher(password: string): Promise<string> {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRound);
    return hashedPassword;
  } catch (error) {
    throw new Error("Canot encrypt the passwords");
  }
}

async function compareIncryptedPassword(username: string, password: string): Promise<string | boolean> {
  const sqlconnection = await mysqlConnect();
  try {
    const [rows] = await sqlconnection.execute("SELECT * FROM username = ?", [username]);
    if (rows.length === 0) throw new Error("Username not fond!");

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new Error("Incorrect password!");
    return true;
  } catch (error) {
    throw error;
  }
}

export default { passwordHasher, compareIncryptedPassword };
