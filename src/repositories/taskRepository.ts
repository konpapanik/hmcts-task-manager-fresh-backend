import { TaskStatus } from '@prisma/client';

import { prisma } from '../lib/prisma';

type PersistedTaskInput = {
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: Date;
};

export async function createTask(data: PersistedTaskInput) {
  return prisma.task.create({ data });
}

export async function getAllTasks() {
  return prisma.task.findMany({
    orderBy: {
      dueDate: 'asc',
    },
  });
}

export async function getTaskById(id: number) {
  return prisma.task.findUnique({
    where: { id },
  });
}

export async function updateTaskStatus(id: number, status: TaskStatus) {
  return prisma.task.update({
    where: { id },
    data: { status },
  });
}

export async function deleteTask(id: number) {
  return prisma.task.delete({
    where: { id },
  });
}