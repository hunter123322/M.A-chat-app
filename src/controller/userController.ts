import { UserTransaction } from "../service/userService";
import passwordController from "./passwordController";
import mySQLConnectionPool from "../controller/mySQLConnectionPool";
import userSignupValidation from "../model/userSignupValidation";

type SQLConn = typeof mySQLConnectionPool;

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

export class UserController {
  private transaction: UserTransaction;

  constructor(private SQLconnection: SQLConn) {
    this.transaction = new UserTransaction(this.SQLconnection);
  }

  public async signController(username: string, password: string): Promise<number> {
    const hashedPassword = await passwordController.passwordHasher(password);
    return this.transaction.signupCredential(username, hashedPassword);
  }

  public async userInformationController(data: UserInfo, user_id: number | undefined): Promise<void> {
    if (!userSignupValidation.userValidation(data)) {
      throw new Error("User information is invalid!");
    }
    await this.transaction.informationCredential(data, user_id);
  }

  public async locationController(data: UserLocation, user_id: number | undefined): Promise<void> {
    if (!userSignupValidation.locationValidation(data)) {
      throw new Error("User location is invalid!");
    }
    await this.transaction.locationCredential(data, user_id);
  }
}
