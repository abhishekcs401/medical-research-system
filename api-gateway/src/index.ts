import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authProxyRoute } from './routes/auth.route';
import { auditProxyRoute } from './routes/audit.route';
import { programProxyRoute } from './routes/program.route';
import { participantProxyRoute } from './routes/participant.route';
import logger from './utils/logger';
import { errorHandler } from './middlewares/error.middleware';

const app = express();
app.use(cookieParser());
app.use(helmet());
app.use(
  cors({
    origin: ['http://localhost:4200'],
    credentials: true,
  })
);
// Proxy Routes
authProxyRoute(app);
auditProxyRoute(app);
programProxyRoute(app);
participantProxyRoute(app);
// Body parsers (after proxy routes to avoid issues)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  logger.info('Health check performed');
  res.status(200).json({ status: 'API Gateway is healthy' });
});

app.use(errorHandler);
// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  logger.info(`🚀 API Gateway running on http://localhost:${PORT}`);
});
