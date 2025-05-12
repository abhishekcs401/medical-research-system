import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { config } from './config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.db.host,
  port: Number(config.db.port), // 👈 ensure port is number
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  entities: [User],
  //dropSchema: true, // 👈 THIS WILL DROP EVERYTHING!
  synchronize: true, // for dev only
  logging: false,
});
