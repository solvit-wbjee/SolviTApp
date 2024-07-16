
require("dotenv").config();
import { Response } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "../models/user.model";
import { redis } from "./redis";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

// Parse environment variables
const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "300", 10);
const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "1200", 10);

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

// Options for cookies
export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
  maxAge: accessTokenExpire * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "none",
  secure: true,
};

export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "none",
  secure: true,
};

// Only set secure true for production
if (process.env.NODE_ENV === "production") {
  accessTokenOptions.secure = true;
}

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  if (!accessTokenSecret || !refreshTokenSecret) {
    return res.status(500).json({ success: false, message: "Secret keys are missing" });
  }

  const accessToken = jwt.sign({ id: user._id }, accessTokenSecret, {
    expiresIn: accessTokenExpire,
  });
  const refreshToken = jwt.sign({ id: user._id }, refreshTokenSecret, {
    expiresIn: refreshTokenExpire,
  });

  // Ensure user._id is treated as a string
  const userId = String(user._id);

  // Upload session to redis
  redis.set(userId, JSON.stringify(user), 'EX', refreshTokenExpire * 24 * 60 * 60);

  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
