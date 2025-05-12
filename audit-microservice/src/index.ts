import dotenv from 'dotenv';
dotenv.config();
import { AppDataSource } from './data-source';
import { startConsumer } from './rabbitmq/consumer';
import app from './app';

const PORT = process.env.PORT || 3002;

AppDataSource.initialize()
  .then(() => {
    console.log('🟢 DB connected');
    startConsumer();
    app.listen(PORT, () => console.log(`🚀 Audit service running at http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ DB connection error:', err);
  });
