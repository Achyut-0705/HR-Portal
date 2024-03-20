import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import Logger from '../middleware/logger';
import { IUserTokenPayload } from '../types/request';
import { getUser, registerUser } from '../services/user.service';
import { TUser, userCreateSchema } from '../types/user';
import ApiError from '../common/utils/ApiError';

const secretKey = `${process.env.SECRET_KEY}`;

export interface UserRequest extends Request {
  userAccessToken?: IUserTokenPayload;
  user?: TUser;
}

export const authenticateToken = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      Logger.warn(
        `[Auth] ⚠️ No token provided for protected route: ${req.path}`
      );
      return res.sendStatus(401);
    }

    const payload = jwt.verify(token, secretKey);

    if (!payload) {
      throw new Error('Token verification failed');
    }

    Logger.info(`[Auth] ✅ Token verified successfully for route: ${req.path}`);

    req.userAccessToken = payload as IUserTokenPayload;

    const user = await getUser(
      { id: payload.sub },
      { password: 0, userActivityHistory: 0, _id: 0 }
    );

    req.user = user as TUser;

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

export const signIn = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body.credentials;

    const user = await getUser({ username });

    if (!user) throw new ApiError(400, `Invalid credentials provided`);

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) throw new ApiError(400, `Invalid credentials provided`);

    const payload: IUserTokenPayload = {
      sub: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    };

    res.send({
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      accessToken: jwt.sign(payload, secretKey, { expiresIn: '12h' })
    });
  } catch (e: any) {
    Logger.error(`[Auth] 🚨 SignIn failed: ${e.message}`);
    return res.status(400).send(e.message || `Invalid credentials provided`);
  }
};

export const singUp = async (req: Request, res: Response) => {
  const { username, password, name, email } = await userCreateSchema.parseAsync(
    req.body
  );

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    const userData = await registerUser({
      username,
      password: hashPassword,
      name,
      email,
      role: 'user', // make user as user by default
      status: 'restricted' // Disable users by default
    });

    if (typeof userData === 'string') {
      if (userData.includes(' already exists.')) {
        Logger.warn(`[Auth] ⚠️ User already exists - ${userData}`);
        return res.status(409).send(userData);
      } else {
        Logger.error(`[Auth] 🚨 User registration failed - ${userData}`);
        return res.status(400).send(userData);
      }
    } else {
      Logger.info(`[Auth] ✅ User registered successfully: ${username}`);
      res.status(200).send('User registered successfully');
    }
  } catch (error) {
    Logger.error(`[Auth] 🚨 Error during user registration - ${error}`);
    res.status(500).send('Something went wrong. Please try again.');
  }
};
