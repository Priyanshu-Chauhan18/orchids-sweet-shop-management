import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../db';
import { config } from '../config';
import { User, UserRole } from '../models/user';

const generateTokens = (user: User) => {
  const payload = { id: user.id, username: user.username, role: user.role };
  const accessToken = jwt.sign(payload, config.jwtSecret, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, config.refreshSecret, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

export const registerUser = async (username: string, password: string, role: UserRole = 'user') => {
  const existing = await query<User>('SELECT * FROM users WHERE username=$1', [username]);
  if (existing.length) throw new Error('User exists');
  const hash = await bcrypt.hash(password, 10);
  const inserted = await query<User>(
    'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING *',
    [username, hash, role]
  );
  const user = inserted[0];
  const tokens = generateTokens(user);
  return { user, tokens };
};

export const loginUser = async (username: string, password: string) => {
  const users = await query<User>('SELECT * FROM users WHERE username=$1', [username]);
  const user = users[0];
  if (!user) throw new Error('Invalid credentials');
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) throw new Error('Invalid credentials');
  const tokens = generateTokens(user);
  return { user, tokens };
};
