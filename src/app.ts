import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { openApiSpec } from './docs/openapi';
import { errorHandler } from './middleware/errorHandler';
import taskRoutes from './routes/taskRoutes';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/api-docs.json', (_req, res) => {
  res.status(200).json(openApiSpec);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.use('/tasks', taskRoutes);

app.use(errorHandler);