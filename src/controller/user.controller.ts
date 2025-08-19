import { UserTransaction } from "../service/user/user.service";
import passwordController from "../service/auth/password.service";
import mySQLConnectionPool from "../db/mysql/mysql.connection-pool";
import userSignupValidation from "../validation/user.signup.validation";
import { UserModel } from "../model/user/user.model";
import { IMessageDocument } from "../model/messages.model";
import type { UserInfo, UserLocation, UserAut } from "../types/User.type";

const user = new UserModel(mySQLConnectionPool);

type SQLConn = typeof mySQLConnectionPool;

export type UserAuthFull = UserAut & UserInfo;

type ApiResponse = {
  user_id: number;
  messages: IMessageDocument[];
  authentication: UserAuthFull;
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
      throw new Error();
    }
    await this.transaction.informationCredential(data, user_id);
  }

  public async locationController(data: UserLocation, user_id: number | undefined): Promise<void> {
    if (!userSignupValidation.locationValidation(data)) {
      throw new Error();
    }
    await this.transaction.locationCredential(data, user_id);
  }

  public async loginController(data: UserAut): Promise<ApiResponse> {
    const authentication = await passwordController.compareEncryptedPassword(data.username, data.password);
    if (!authentication) {
      throw new Error("Invalid Login!");
    }
    const initMessage = await user.initMessage(authentication.user_id as number);

    return {
      user_id: authentication.user_id as number,
      messages: initMessage,
      authentication,
    };
  }
}

