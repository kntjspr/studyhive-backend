import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    error: {
      code: 'NotFound',
      message: `Cannot ${req.method} ${req.path}`
    }
  });
}; 