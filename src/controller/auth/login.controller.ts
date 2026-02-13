import { Request, Response } from "express";
import mySQLConnectionPool from "../../db/mysql/mysql.connection-pool.js";
import { UserController } from "../user.controller.js";
import type { UserAut } from "../../types/User.type.js";
import { RefreshTokenModel } from "../../model/token/refresh.token.model.js";
import { generateRefreshToken, generateToken } from "../../middleware/authentication.js";

type Login = {
  email: string;
  password: string;
  device: any
}

async function postLogin(req: Request, res: Response): Promise<void> {
  const User = new UserController(mySQLConnectionPool);

  try {
    const userData: Login = req.body;

    if (!userData.email || !userData.password || !userData.device) {
      res.status(400).json({ error: "email and password required" });
      return;
    }

    const data = await User.loginController(userData);
    if (!data) {
      res.status(500).json({ message: "Try Again" })
      return
    }

    const doc = await RefreshTokenModel.insertOne({ deviceFingerPrint: userData.device })
    if (!doc) {
      res.status(500).json({ message: "Failed to create refresh token" })
      return
    }

    const userProfile = await User.initProfile(data.user_id, true)


    const author = {
      id: data.user_id,
      username: data.authentication.username,
      avatarUrl: userProfile.userProfileData.user_avatar
    }

    const token = generateToken({
      user_id: data.user_id,
      author: author
    });

    const refreshToken = generateRefreshToken({
      user_id: data.user_id,
      author: author,
      deviceFingerPrint: doc._id
    });

    res
      .cookie("MAAccessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "production",
        sameSite: "lax",
        priority: "high",
        maxAge: 60 * 1000
      }).cookie("MARefreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "production",
        sameSite: "lax",
        priority: "medium",
        maxAge: 60 * 60 * 24 * 7 * 30 * 3 * 1000
      })
      .status(200)
      .json({
        message: "Login successful",
        token,
        user_id: data.user_id,
        messages: data.messages,
        userInfo: data.authentication,
        userProfile,
      });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
    console.log("Error at ==login.controller== :", error);

  }
}

export { postLogin }; 