import Message from "./messagesModel";
import { RowDataPacket, Pool, PoolConnection} from 'mysql2/promise';

interface Init {
  user_id: number,
  firstName: string,
  lastName: string,
  middleName: string,
  age: number,
}

export class UserModel {
    private connection: Promise<PoolConnection>;

    constructor(mySQLConnection: Pool) {
        this.connection = mySQLConnection.getConnection();
    }

    public async initMessage(user_id: number) {
        try {
            const sendedMessage = await Message.find({ senderID: user_id })
                .sort({ createdAt: -1 })
                .limit(20);

            const receiveMessage = await Message.find({ receiverID: user_id })
                .sort({ createdAt: -1 })
                .limit(20);

            const message = sendedMessage.concat(receiveMessage);
            message.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            return message
        } catch (error) {
            throw error
        }
    }

    public async initUserInfo(user_id: number) {
        const SQLConn = await this.connection
        try {
            const [rows] = await SQLConn.query<RowDataPacket[]>(
                "SELECT * FROM users_info WHERE user_id = ?",
                [user_id]
            );

            const returnValue = rows[0]
            return rows[0]
        } catch (error) {

        }
    }
}
