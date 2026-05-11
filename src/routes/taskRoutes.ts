import { Router } from 'express';

import {
  createTaskHandler,
  deleteTaskHandler,
  getTaskByIdHandler,
  getTasksHandler,
  updateTaskStatusHandler,
} from '../controllers/taskController';

const router = Router();

router.post('/', createTaskHandler);
router.get('/', getTasksHandler);
router.get('/:id', getTaskByIdHandler);
router.patch('/:id/status', updateTaskStatusHandler);
router.delete('/:id', deleteTaskHandler);

export default router;