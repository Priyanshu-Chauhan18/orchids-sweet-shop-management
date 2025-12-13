import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface AuthRequest extends Request {
  user?: { id: number; username: string; role: string };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Missing token' });
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, config.jwtSecret) as any;
    req.user = { id: payload.id, username: payload.username, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  next();
};
