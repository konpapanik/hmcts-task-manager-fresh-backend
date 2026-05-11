import cors from 'cors';
import express from 'express';

import taskRoutes from './routes/taskRoutes';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/tasks', taskRoutes);