import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../errors';

export const isAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Assuming the user's role is attached to `req.user` (from the `authenticateUser` middleware)
  if (req.user?.role !== 'admin') {
    return next(new UnauthorizedError('You must be an admin to perform this action.'));
  }

  next();
};
