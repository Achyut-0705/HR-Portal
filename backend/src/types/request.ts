import { TUser, TUserRole, TUserStatus } from './user';
import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

export interface IUserTokenPayload extends JwtPayload {
  username: string;
  name: string;
  email: string;
  role: TUserRole;
  status: TUserStatus;
}
export interface ExtendedRequest extends Request {
  userAccessToken: IUserTokenPayload;
  user: TUser;
}
