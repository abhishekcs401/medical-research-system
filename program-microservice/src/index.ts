import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import { AppDataSource } from './config/data-source';

const PORT = process.env.PORT || 3001;

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Database connection error:', error);
    process.exit(1); // Ensure process exits in case of a database connection failure
  });
