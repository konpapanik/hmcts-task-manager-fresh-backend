import { Request, Response } from 'express';

import type { CreateTaskInput, UpdateTaskStatusInput } from '../types/task';
import { AppError } from '../middleware/errorHandler';
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTaskStatus,
} from '../services/taskService';

export async function createTaskHandler(req: Request, res: Response) {
  const input = req.body as CreateTaskInput;

  const task = await createTask(input);
  return res.status(201).json(task);
}

export async function getTasksHandler(_req: Request, res: Response) {
  const tasks = await getTasks();
  return res.status(200).json(tasks);
}

export async function getTaskByIdHandler(req: Request, res: Response) {
  const taskId = Number(req.params.id);

  const task = await getTaskById(taskId);

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  return res.status(200).json(task);
}

export async function updateTaskStatusHandler(req: Request, res: Response) {
  const taskId = Number(req.params.id);
  const input = req.body as UpdateTaskStatusInput;

  const task = await updateTaskStatus(taskId, input);
  return res.status(200).json(task);
}

export async function deleteTaskHandler(req: Request, res: Response) {
  const taskId = Number(req.params.id);

  await deleteTask(taskId);
  return res.status(204).send();
}