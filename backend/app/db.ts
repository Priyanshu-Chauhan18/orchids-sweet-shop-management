import { Pool } from 'pg';
import { config } from './config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({ connectionString: config.databaseUrl });

export const query = async <T = any>(text: string, params?: any[]): Promise<T[]> => {
  const res = await pool.query(text, params);
  return res.rows as T[];
};

export const getClient = async () => pool.connect();

export const runMigrations = async () => {
  const sqlPath = path.join(__dirname, 'db', 'schema.sql');
  const sql = fs.readFileSync(sqlPath, 'utf-8');
  await pool.query(sql);
};

export default pool;