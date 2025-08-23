import { Request, Response } from "express";
import { SQLConn } from "../../db/mysql/mysql.connection-pool";

async function searchContact(req: Request, res: Response) {
    try {
        const dbConnection = await SQLConn;

        // 👈 grab from req.query, not req.params
        const { contactSearch } = req.query as { contactSearch?: string };
        
        if (!contactSearch) {
            res.status(400).json({ message: "Missing search query" });
            return;

        }

        // Use LIKE for partial search
        const [rows] = await dbConnection.query(
            "SELECT * FROM users_info WHERE firstName LIKE ?",
            [`%${contactSearch}%`]
        );

        dbConnection.release();

        if (!rows || (Array.isArray(rows) && rows.length === 0)) {
            res.status(204).json({ message: "No such user!" });
            return;

        }

        res.status(200).json(rows);
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export { searchContact };
