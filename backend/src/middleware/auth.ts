import { NextFunction, Response, Request } from 'express';

import ApiError from '../common/utils/ApiError';

import { TUserRole, TUserStatus } from '../types/user';
import { ExtendedRequest } from '../types/request';
import { stat } from 'fs';

export const withAuthRole =
  (roles: TUserRole[]) => (req: Request, res: Response, next: NextFunction) => {
    const ExtendedRequest = req as ExtendedRequest;
    const role = ExtendedRequest.user.role;

    try {
      if (!roles.includes(role)) throw new Error();
      next();
    } catch (e) {
      throw new ApiError(403, 'Unauthorized access');
    }
  };

export const withAuthStatus =
  (statuses: TUserStatus[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const ExtendedRequest = req as ExtendedRequest;
    const userStatus = ExtendedRequest.user.status;
    try {
      if (!statuses.includes(userStatus)) throw new Error();
      next();
    } catch (e) {
      throw new ApiError(403, 'Unauthorized access');
    }
  };
