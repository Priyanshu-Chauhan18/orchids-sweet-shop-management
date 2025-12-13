import dotenv from 'dotenv';

dotenv.config();

export const config = {
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  refreshSecret: process.env.REFRESH_SECRET || 'dev-refresh',
  port: Number(process.env.PORT) || 4000,
};

if (!config.databaseUrl) {
  throw new Error('DATABASE_URL is required');
}
