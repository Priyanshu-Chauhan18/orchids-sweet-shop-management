import { z } from 'zod';

export const sweetCreateSchema = z.object({
  name: z.string().min(2),
  category: z.string().min(2),
  price: z.number().nonnegative(),
  quantity: z.number().int().nonnegative()
});

export const sweetUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  category: z.string().min(2).optional(),
  price: z.number().nonnegative().optional(),
  quantity: z.number().int().nonnegative().optional()
});

export const searchSchema = z.object({
  q: z.string().min(1)
});
