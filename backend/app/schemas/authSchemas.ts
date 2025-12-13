import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  role: z.enum(['user', 'admin']).optional()
});

export const loginSchema = z.object({
  username: z.string(),
  password: z.string()
});
