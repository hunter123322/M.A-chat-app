import { UserTransaction } from "../service/userService";
import passwordController from "./passwordController";
import mySQLConnectionPool from "../controller/mySQLConnectionPool";
import userSignupValidation from "../model/userSignupValidation";
import { UserModel } from "../model/userModel";

const user = new UserModel(mySQLConnectionPool);

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

interface UserAut {
  user_id: number;
  username: string;
  password: string;
}

interface UserMessages {
  user_id: number;
  messages: Object[];
  authentication?: undefined;
}

interface UserAuthentication {
  authentication: {
    user_id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    middleName: string;
    age: number;
  };
  messages?: undefined;
}

type UserData = UserMessages | UserAuthentication;

// The complete response type would be:
type ApiResponse = UserData[];

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

  public async loginController(data: UserAut) {
    const authentication = await passwordController.compareEncryptedPassword(data.username, data.password);
    if (!authentication) {
      throw new Error("Invalid Login!");
    }
    const initMessage = await user.initMessage(authentication.user_id);
    
    return [{
      user_id: authentication.user_id,
      messages: initMessage ?? [],
    }, { authentication }];
  }
}

