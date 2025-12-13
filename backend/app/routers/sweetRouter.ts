import express from 'express';
import asyncHandler from 'express-async-handler';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/authMiddleware';
import { sweetCreateSchema, sweetUpdateSchema, searchSchema } from '../schemas/sweetSchemas';
import { createSweet, deleteSweet, listSweets, purchaseSweet, restockSweet, searchSweets, updateSweet } from '../services/sweetService';

const router = express.Router();

router.use(authenticate);

router.post('/', requireAdmin, asyncHandler(async (req: AuthRequest, res) => {
  const data = sweetCreateSchema.parse(req.body);
  const sweet = await createSweet(data);
  res.status(201).json(sweet);
}));

router.get('/', asyncHandler(async (_req, res) => {
  const sweets = await listSweets();
  res.json(sweets);
}));

router.get('/search', asyncHandler(async (req, res) => {
  const { q } = searchSchema.parse(req.query);
  const results = await searchSweets(q);
  res.json(results);
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const data = sweetUpdateSchema.parse(req.body);
  const sweet = await updateSweet(id, data);
  res.json(sweet);
}));

router.delete('/:id', requireAdmin, asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  await deleteSweet(id);
  res.status(204).send();
}));

router.post('/:id/purchase', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const qty = Number(req.body.quantity || 1);
  const updated = await purchaseSweet(id, qty);
  res.json(updated);
}));

router.post('/:id/restock', requireAdmin, asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const qty = Number(req.body.quantity || 1);
  const updated = await restockSweet(id, qty);
  res.json(updated);
}));

export default router;
