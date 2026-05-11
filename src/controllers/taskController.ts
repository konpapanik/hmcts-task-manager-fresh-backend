import { Prisma, TaskStatus } from '@prisma/client';
import { Request, Response } from 'express';

import type { CreateTaskInput, UpdateTaskStatusInput } from '../types/task';
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTaskStatus,
} from '../services/taskService';

function parseTaskId(rawId: string | string[] | undefined): number | null {
  if (typeof rawId !== 'string') {
    return null;
  }

  const taskId = Number(rawId);

  if (!Number.isInteger(taskId) || taskId <= 0) {
    return null;
  }

  return taskId;
}

function isValidStatus(value: unknown): value is TaskStatus {
  return value === 'TODO' || value === 'IN_PROGRESS' || value === 'DONE';
}

function normalizeCreateBody(body: Request['body']): CreateTaskInput | null {
  if (typeof body?.title !== 'string' || !isValidStatus(body?.status) || typeof body?.dueDate !== 'string') {
    return null;
  }

  return {
    title: body.title,
    description: typeof body.description === 'string' ? body.description : undefined,
    status: body.status,
    dueDate: body.dueDate,
  };
}

function normalizeStatusBody(body: Request['body']): UpdateTaskStatusInput | null {
  if (!isValidStatus(body?.status)) {
    return null;
  }

  return {
    status: body.status,
  };
}

export async function createTaskHandler(req: Request, res: Response) {
  const input = normalizeCreateBody(req.body);

  if (!input) {
    return res.status(400).json({ message: 'title, status and dueDate are required' });
  }

  if (Number.isNaN(new Date(input.dueDate).getTime())) {
    return res.status(400).json({ message: 'dueDate must be a valid ISO date-time string' });
  }

  const task = await createTask(input);
  return res.status(201).json(task);
}

export async function getTasksHandler(_req: Request, res: Response) {
  const tasks = await getTasks();
  return res.status(200).json(tasks);
}

export async function getTaskByIdHandler(req: Request, res: Response) {
  const taskId = parseTaskId(req.params.id);

  if (!taskId) {
    return res.status(400).json({ message: 'id must be a positive integer' });
  }

  const task = await getTaskById(taskId);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  return res.status(200).json(task);
}

export async function updateTaskStatusHandler(req: Request, res: Response) {
  const taskId = parseTaskId(req.params.id);
  const input = normalizeStatusBody(req.body);

  if (!taskId) {
    return res.status(400).json({ message: 'id must be a positive integer' });
  }

  if (!input) {
    return res.status(400).json({ message: 'status is required' });
  }

  try {
    const task = await updateTaskStatus(taskId, input);
    return res.status(200).json(task);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ message: 'Task not found' });
    }

    throw error;
  }
}

export async function deleteTaskHandler(req: Request, res: Response) {
  const taskId = parseTaskId(req.params.id);

  if (!taskId) {
    return res.status(400).json({ message: 'id must be a positive integer' });
  }

  try {
    await deleteTask(taskId);
    return res.status(204).send();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ message: 'Task not found' });
    }

    throw error;
  }
}