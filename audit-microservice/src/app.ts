import express from 'express';
import auditRoutes from './routes/audit.routes';

const app = express();

app.use(express.json());
app.use('/api', auditRoutes);

export default app;
