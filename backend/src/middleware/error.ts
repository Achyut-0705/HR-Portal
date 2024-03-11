import { ZodError } from 'zod';

import { Request, Response, NextFunction } from 'express';
import Logger from './logger';
import ApiError from '../common/utils/ApiError';

export const errorConverter = (
  err: any,
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    next({
      statusCode: 400,
      error: err.format(),
      stack: err.stack,
      isOperational: true
    });
    return;
  }

  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode ? error.statusCode : 500;
    const message = error.message || 'Something went wrong!';
    error = new ApiError(statusCode, message, false, err.stack);
  }

  next(error);
};

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let { statusCode, message, stack, error, isOperational, ...restParams } = err;
  const isProduction = process.env.NODE_ENV === 'production';
  // if ( isProduction && !err.isOperational) {
  //   statusCode = 500
  //   message = 'Internal Server error'
  // }

  res.locals.errorMessage = err.message;

  const response = {
    // status: statusCode,
    message,
    error,
    ...restParams,
    ...(!isProduction && { stack: stack })
  };

  if (!isProduction) {
    Logger.error(err.message);
  }

  res.status(statusCode).json(response);
};
