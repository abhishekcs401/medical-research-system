import { Express } from 'express';
import { rateLimiter } from '../middlewares/rateLimiter';
import { authProxy } from '../proxy/auth.proxy';

export const authProxyRoute = (app: Express) => {
  app.use('/api/auth', rateLimiter, authProxy);
};
