import express from 'express';
import authRoutes from './routes/auth.routes';
import { globalErrorHandler } from './middlewares/error.middleware';
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:4200', // Angular frontend
    credentials: true, // Allow cookies/auth headers
  })
);

// Routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use(globalErrorHandler);

export default app;
