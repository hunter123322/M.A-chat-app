import { RowDataPacket } from 'mysql2/promise';
import mySQLConnectionPool from './db/mysql/mysql.connection-pool';

async function initUserInfo(user_id: number) {
  const connection = await mySQLConnectionPool.getConnection();
  try {
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM users_info WHERE user_id = ?",
      [user_id]
    );
    console.log(rows[0]);
     rows[0]
  } catch (error) {
    console.log(error);
    
  }
}

initUserInfo(1)