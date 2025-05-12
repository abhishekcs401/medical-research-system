import { Express } from 'express';
import { rateLimiter } from '../middlewares/rateLimiter';
import { validateJWT } from '../middlewares/jwtValidator';
import { checkPermission } from '../middlewares/permissions';
import { programProxy } from '../proxy/program.proxy';

export const programProxyRoute = (app: Express): void => {
  app.use('/api/programs', rateLimiter, validateJWT, checkPermission, programProxy);
};
