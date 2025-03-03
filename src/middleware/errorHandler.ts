import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../utils/logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error:', {
    error: err,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params
  });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.name,
        message: err.message,
        details: err.details
      }
    });
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: {
      code: 'InternalServerError',
      message: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    }
  });
}; 