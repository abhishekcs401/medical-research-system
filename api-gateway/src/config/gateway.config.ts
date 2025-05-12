import dotenv from 'dotenv';
dotenv.config();

export const config = {
  authServiceUrl: process.env.AUTH_SERVICE_URL!,
  auditServiceUrl: process.env.AUDIT_SERVICE_URL!,
  programServiceUrl: process.env.PROGRAM_SERVICE_URL!,
};
