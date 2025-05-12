import { Request, Response, NextFunction } from 'express';

// Extend Express's Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

// Properly typed middleware function
export const userContextMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const user = {
    id: req.headers['x-user-id'] as string,
    email: req.headers['x-user-email'] as string,
    role: req.headers['x-user-role'] as string,
  };
  req.user = user;
  next();
};
