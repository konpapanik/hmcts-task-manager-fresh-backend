import { TaskStatus } from '@prisma/client';

import type { CreateTaskInput, UpdateTaskStatusInput } from '../types/task';
import {
  createTask as createTaskRecord,
  deleteTask as deleteTaskRecord,
  getAllTasks as getAllTaskRecords,
  getTaskById as getTaskRecordById,
  updateTaskStatus as updateTaskStatusRecord,
} from '../repositories/taskRepository';

export async function createTask(input: CreateTaskInput) {
  return createTaskRecord({
    title: input.title.trim(),
    description: input.description?.trim() || null,
    status: input.status,
    dueDate: new Date(input.dueDate),
  });
}

export async function getTasks() {
  return getAllTaskRecords();
}

export async function getTaskById(id: number) {
  return getTaskRecordById(id);
}

export async function updateTaskStatus(id: number, input: UpdateTaskStatusInput) {
  return updateTaskStatusRecord(id, input.status as TaskStatus);
}

export async function deleteTask(id: number) {
  return deleteTaskRecord(id);
}