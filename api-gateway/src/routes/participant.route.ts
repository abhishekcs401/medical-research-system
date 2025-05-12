import { Express } from 'express';
import { participantProxy } from '../proxy/participant.proxy';
import { rateLimiter } from '../middlewares/rateLimiter';
import { validateJWT } from '../middlewares/jwtValidator';
import { checkPermission } from '../middlewares/permissions';

export const participantProxyRoute = (app: Express) => {
  app.use('/api/participants', rateLimiter, validateJWT, checkPermission, participantProxy);
};
