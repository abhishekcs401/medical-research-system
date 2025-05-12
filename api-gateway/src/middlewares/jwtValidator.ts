import dotenv from 'dotenv';
dotenv.config();
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';

interface DecodedToken {
  id: string;
  role?: string;
  email?: string;
  [key: string]: any;
}

export const validateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.error('Missing or invalid Authorization header');
    res.status(401).json({ message: 'Missing or invalid Authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    // Attach decoded token to req.user
    (req as any).user = {
      id: decoded.id,
      email: decoded.email || '',
      role: decoded.role || 'user',
    };
    logger.info(`JWT validated successfully for user: ${decoded.sub}`);
    next();
  } catch (err) {
    logger.error('JWT validation error: ' + (err as Error).message);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};
