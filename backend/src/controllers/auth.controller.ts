import Logger from "../middleware/logger";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUserTokenPayload } from "../types/request";

const secretKey = `${process.env.SECRET_KEY}`;

export interface UserRequest extends Request {
  userAccessToken?: IUserTokenPayload;
}

export const authenticateToken = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const publicPaths: string[] = [];

    if (publicPaths.includes(req.path)) {
      next();
      return;
    }

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      Logger.warn(
        `[Auth] ⚠️ No token provided for protected route: ${req.path}`
      );
      return res.sendStatus(401);
    }

    const payload = jwt.verify(token, secretKey);

    if (!payload) {
      throw new Error("Token verification failed");
    }

    Logger.info(`[Auth] ✅ Token verified successfully for route: ${req.path}`);

    req.userAccessToken = payload as IUserTokenPayload;

    // const user = await getUser(
    //   { id: payload.sub },
    //   { password: 0, userActivityHistory: 0, _id: 0 }
    // );

    // req.user = user;

    next();
  } catch (e) {
    Logger.error(
      `[Auth] 🚨 Token verification failed for route: ${req.path}, Error: ${
        (e as Error).message
      }`
    );

    return res.sendStatus(403);
  }
};
