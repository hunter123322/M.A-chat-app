import { generateToken } from "../../middleware/authentication.js";
import jwt, { decode } from "jsonwebtoken";
import type { JTWRefreshToken } from "../../types/jtw.payload.type";
import { RefreshTokenModel } from "../../model/token/refresh.token.model.js";

const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh-secret";

export class Token {
    static async refresh(token: string, deviceInfo: string): Promise<string | undefined> {
        if (!token || !deviceInfo) return;

        try {
            const ref = decode(token) as JTWRefreshToken;
            if (!ref) throw new Error("Invalid refresh token");

            const doc = await RefreshTokenModel.findById(ref.deviceFingerPrint);
            if (!doc || doc.deviceFingerPrint !== deviceInfo) {
                throw new Error("Device information does not match");
            }

            const decoded = jwt.verify(token, REFRESH_SECRET) as JTWRefreshToken;

            return generateToken({
                user_id: decoded.user_id,
                author: decoded.author
            });
        } catch {
            throw new Error("Invalid or expired refresh token");
        }
    }
}
