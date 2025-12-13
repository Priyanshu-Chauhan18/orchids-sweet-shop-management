import { runMigrations, query } from '../db';

export const resetDB = async () => {
  await runMigrations();
  await query('TRUNCATE sweets RESTART IDENTITY CASCADE');
  await query('TRUNCATE users RESTART IDENTITY CASCADE');
};
