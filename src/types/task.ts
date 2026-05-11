import { TaskStatus } from '@prisma/client';

export type CreateTaskInput = {
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate: string;
};

export type UpdateTaskStatusInput = {
  status: TaskStatus;
};