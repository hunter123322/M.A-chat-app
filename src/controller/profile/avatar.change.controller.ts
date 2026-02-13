import { Request, Response } from "express";
import type { JWTPayload } from "../../types/jtw.payload.type";
import { SQLConn } from "../../db/mysql/mysql.connection-pool";
import type { ResultSetHeader } from "mysql2";

type AuthRequest<T = any> = Request<unknown, unknown, T> & {
    user?: JWTPayload;
};

export class Avatar {
    static async change(req: AuthRequest<{ id: number }>, res: Response) {
        const conn = await SQLConn;

        try {
            console.log(req.body.id);
            
            const avatar = Number(req.body.id);
            const userID = req.user?.user_id;

            if (!userID) {
                res.status(401).json({ message: "Unauthorized: Missing user info" });
                return;
            }

            if (typeof avatar !== "number" || avatar < 1 || avatar > 10) {
                res.status(400).json({ message: "Invalid avatar ID" });
                return;
            }

            await conn.beginTransaction();

            const [result] = await conn.execute<ResultSetHeader>(
                `UPDATE users_profile SET user_avatar = ? WHERE user_id = ?`,
                [avatar, userID]
            );

            if (result.affectedRows === 0) {
                await conn.rollback();
                res.status(404).json({ message: "User not found or no changes made" });
                return;
            }

            await conn.commit();

            res.status(200).json({
                message: "Avatar updated successfully"
            });
        } catch (error) {
            console.error("❌ Avatar Change Error:", error);
            await conn.rollback();
            res.status(500).json({ message: "Error changing avatar!" });
        } finally {
            conn.release();
        }
    }
}
