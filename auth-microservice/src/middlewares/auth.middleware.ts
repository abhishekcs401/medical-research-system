import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.util';
import { UnauthorizedError } from '../errors';
import { CustomJwtPayload } from '../types/jwtPayload';

interface CustomRequest extends Request {
  user?: CustomJwtPayload;
}

export const authenticateUser = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return next(new UnauthorizedError('No token provided'));
  }

  try {
    const decoded = verifyAccessToken(token) as CustomJwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return next(new UnauthorizedError('Invalid or expired token'));
  }
};
