import 'dotenv/config'; // Load env variables early
import { AppDataSource } from './config/data-source';
import app from './app';

const PORT = Number(process.env.PORT) || 3000;

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server is running on http://0.0.0.0:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Failed to initialize Data Source:', err);
    process.exit(1); // Exit to avoid running app without DB
  });
