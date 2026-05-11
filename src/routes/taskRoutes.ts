import { Router } from 'express';

import {
  createTaskHandler,
  deleteTaskHandler,
  getTaskByIdHandler,
  getTasksHandler,
  updateTaskStatusHandler,
} from '../controllers/taskController';
import { validate } from '../middleware/validate';
import { createTaskSchema, taskIdParamsSchema, updateTaskStatusSchema } from '../validators/taskSchemas';

const router = Router();

router.post('/', validate(createTaskSchema, 'body'), createTaskHandler);
router.get('/', getTasksHandler);
router.get('/:id', validate(taskIdParamsSchema, 'params'), getTaskByIdHandler);
router.patch('/:id/status', validate(taskIdParamsSchema, 'params'), validate(updateTaskStatusSchema, 'body'), updateTaskStatusHandler);
router.delete('/:id', validate(taskIdParamsSchema, 'params'), deleteTaskHandler);

export default router;