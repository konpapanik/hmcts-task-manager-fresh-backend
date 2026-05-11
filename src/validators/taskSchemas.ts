import { TaskStatus } from '@prisma/client';
import { z } from 'zod';

const futureDateString = z.string().datetime('dueDate must be a valid ISO date-time string').refine(value => {
  return new Date(value).getTime() > Date.now();
}, 'dueDate must be in the future');

export const taskIdParamsSchema = z.object({
  id: z.coerce.number().int('id must be an integer').positive('id must be a positive integer'),
});

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'title is required').max(100, 'title must be 100 characters or fewer'),
  description: z.string().trim().max(500, 'description must be 500 characters or fewer').optional(),
  status: z.nativeEnum(TaskStatus, {
    error: () => ({ message: 'status must be one of TODO, IN_PROGRESS, or DONE' }),
  }),
  dueDate: futureDateString,
});

export const updateTaskStatusSchema = z.object({
  status: z.nativeEnum(TaskStatus, {
    error: () => ({ message: 'status must be one of TODO, IN_PROGRESS, or DONE' }),
  }),
});