import express from 'express';
import cors from 'cors';
import authRouter from './routers/authRouter';
import sweetRouter from './routers/sweetRouter';
import { config } from './config';
import { runMigrations } from './db';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRouter);
app.use('/api/sweets', sweetRouter);

const start = async () => {
  await runMigrations();
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
};

if (process.env.JEST_WORKER_ID === undefined) {
  start();
}

export default app;
