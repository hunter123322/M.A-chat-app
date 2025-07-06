import { IMessageDocument } from "../messagesModel"
import { RowDataPacket, Pool, PoolConnection } from 'mysql2/promise';
import { initMessage } from "./user.mongo.model";
import { initUserInfo } from "./user.sql.model";

export class UserModel {
    private connection: Promise<PoolConnection>;

    constructor(mySQLConnection: Pool) {
        this.connection = mySQLConnection.getConnection();
    }

    public async initMessage(user_id: number): Promise<IMessageDocument[]> {
        try {
            return initMessage(user_id);
        } catch (error) {
            throw error
        }
    }

    public async initUserInfo(user_id: number) {
        try {
            return initUserInfo(user_id);
        } catch (error) {

        }
    }
}
