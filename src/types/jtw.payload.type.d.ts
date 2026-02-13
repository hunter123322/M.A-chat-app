import { User } from "./User.type";

export type JWTPayload = {
  user_id: number;
  author?: User
}

export type JTWRefreshToken = {
  user_id: number;
  author: User
  deviceFingerPrint: any | undefined
}