import { Request, Response } from "express";

export async function apiAuthCheck(req: Request, res: Response) {
    try {
        const auth = (req.session as { user_id?: number }).user_id;
        if (auth) {
            // ✅ verify session from DB or memory (example check only)
            res.status(200).json({ loggedIn: true });
            return
        }
        console.log(auth, 123456578);

        res.status(401).json({ loggedIn: false });
    } catch (error) {
        console.error("Auth check error:", error);
        res.status(500).json({ loggedIn: false, error: "Server error" });
    }
}
