import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import programRoutes from './routes/program.routes';
import participantRoutes from './routes/participant.routes';
import { globalErrorHandler } from './middlewares/error.middleware';
import { userContextMiddleware } from './middlewares/userContext.middleware';

const app = express();

// Middleware setup
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

const corsOptions = {
  origin: ['http://localhost:4200'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(userContextMiddleware);

// Static file serving
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/programs', programRoutes);
app.use('/api/participants', participantRoutes);

// Error handler
app.use(globalErrorHandler);

export default app;
