import { ResultSetHeader, Pool, PoolConnection } from "mysql2/promise";

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

export class UserTransaction {
    constructor(private pool: Pool) { }

    private async withTransaction<T>(operation: (conn: PoolConnection) => Promise<T>): Promise<T> {
        const conn = await this.pool.getConnection();

        try {
            await conn.beginTransaction();
            const result = await operation(conn);
            await conn.commit();
            return result;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }

    public async signupCredential(
        username: string,
        hashedPassword: string
    ): Promise<number> {
        return this.withTransaction(async (conn) => {
            const [result] = await conn.execute<ResultSetHeader>(
                `INSERT INTO users_auth (username, password) VALUES (?, ?)`,
                [username, hashedPassword]
            );
            return result.insertId;
        });
    }

    public async informationCredential(
        data: UserInfo,
        userId: number | undefined
    ): Promise<void> {
        return this.withTransaction(async (conn) => {
            const [result] = await conn.execute<ResultSetHeader>(
                `INSERT INTO users_info (user_id, firstName, lastName, middleName, age) 
                VALUES (?, ?, ?, ?, ?)`,
                [userId, data.firstName, data.lastName, data.middleName, data.age]
            );

            if (result.affectedRows === 0) {
                throw new Error("User information insert failed");
            }
        });
    }

    public async locationCredential(
        data: UserLocation,
        userId: number | undefined
    ): Promise<void> {
        return this.withTransaction(async (conn) => {
            await conn.execute<ResultSetHeader>(
                `INSERT INTO users_location 
                (user_id, country, region, district, municipality, barangay, zone, house_number) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    userId,
                    data.country,
                    data.region,
                    data.district,
                    data.municipality,
                    data.barangay,
                    data.zone,
                    data.house_number
                ]
            );
        });
    }

}