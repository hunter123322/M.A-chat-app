import { Request, Response } from "express";
import path from "path";


async function getContact(req: Request, res: Response): Promise<void> {
    try {
        

    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}