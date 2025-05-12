import dotenv from 'dotenv';

dotenv.config();

export const config = {
  db: {
    host: process.env.DB_HOST as string,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    username: process.env.DB_USERNAME as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_DATABASE as string,
  },
  jwt: {
    accessSecret: process.env.JWT_SECRET as string,
    refreshSecret: process.env.JWT_REFRESH_SECRET as string,
    resetSecret: process.env.JWT_RESET_SECRET as string,
  },
  smtp: {
    host: process.env.SMTP_HOST as string,
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
    user: process.env.SMTP_USER as string,
    pass: process.env.SMTP_PASS as string,
  },
};
