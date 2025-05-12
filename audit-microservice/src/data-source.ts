import { DataSource } from 'typeorm';
import { DeleteAudit } from './entities/DeleteAudit';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [DeleteAudit],
  synchronize: true, // Set to false in production
});
