import { Express } from 'express';
import { rateLimiter } from '../middlewares/rateLimiter';
import { validateJWT } from '../middlewares/jwtValidator';
import { auditProxy } from '../proxy/audit.proxy';

export const auditProxyRoute = (app: Express) => {
  app.use('/api/audits', rateLimiter, validateJWT, auditProxy);
};
