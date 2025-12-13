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

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  const status = err.status || 400;
  res.status(status).json({ message: err.message || 'Error' });
});

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