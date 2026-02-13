import type { Request, Response } from "express";
import type { JWTPayload } from "../../types/jtw.payload.type";
import { Token } from "../../service/token/token.service";

type AuthRequest<T = any> = Request<unknown, unknown, T> & {
    user?: JWTPayload;
};

export class TokenController {
    static async refresh(req: AuthRequest, res: Response) {
        console.log("Someone called the refresh token");

        try {
            const refreshToken = req.cookies.MARefreshToken;
            const deviceInfo = req.query.deviceInfo as string;

            if (!refreshToken || !deviceInfo) {
                res.status(442).json("Try again");
                return;
            }

            const newToken = await Token.refresh(refreshToken, deviceInfo);

            if (!newToken) {
                res.status(442).json("Try again");
                return;
            }

            res.cookie("MAAccessToken", newToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "production",
                sameSite: "lax",
                priority: "high",
                maxAge: 60 * 1000
            }).status(201).json({ token: newToken });
        } catch (error) {
            res.status(401).json("Invalid refresh request");
            console.log("Error at ==token.controller== :", error);

        }
    }
}
