import express from 'express';
import asyncHandler from 'express-async-handler';
import { registerSchema, loginSchema } from '../schemas/authSchemas';
import { loginUser, registerUser } from '../services/authService';

const router = express.Router();

router.post('/register', asyncHandler(async (req, res) => {
  const parsed = registerSchema.parse(req.body);
  const { user, tokens } = await registerUser(parsed.username, parsed.password, parsed.role || 'user');
  res.status(201).json({ user: { id: user.id, username: user.username, role: user.role }, ...tokens });
}));

router.post('/login', asyncHandler(async (req, res) => {
  const parsed = loginSchema.parse(req.body);
  const { user, tokens } = await loginUser(parsed.username, parsed.password);
  res.json({ user: { id: user.id, username: user.username, role: user.role }, ...tokens });
}));

export default router;
