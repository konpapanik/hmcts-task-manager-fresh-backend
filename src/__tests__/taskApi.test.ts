import request from 'supertest';

import { app } from '../app';
import { prisma } from '../lib/prisma';

describe('Task API', () => {
  beforeEach(async () => {
    await prisma.task.deleteMany();
  });

  afterAll(async () => {
    await prisma.task.deleteMany();
    await prisma.$disconnect();
  });

  test('creates a task and returns it in the list', async () => {
    const createResponse = await request(app)
      .post('/tasks')
      .send({
        title: 'Prepare hearing bundle',
        description: 'Collect the final chronology',
        status: 'TODO',
        dueDate: '2030-05-12T10:00:00.000Z',
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.title).toBe('Prepare hearing bundle');
    expect(createResponse.body.status).toBe('TODO');

    const listResponse = await request(app).get('/tasks');

    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toHaveLength(1);
    expect(listResponse.body[0].title).toBe('Prepare hearing bundle');
  });

  test('gets a task by id', async () => {
    const createdTask = await prisma.task.create({
      data: {
        title: 'Review evidence',
        description: 'Check supporting attachments',
        status: 'IN_PROGRESS',
        dueDate: new Date('2030-05-12T10:00:00.000Z'),
      },
    });

    const response = await request(app).get(`/tasks/${createdTask.id}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdTask.id);
    expect(response.body.title).toBe('Review evidence');
  });

  test('updates a task status', async () => {
    const createdTask = await prisma.task.create({
      data: {
        title: 'Draft order',
        description: null,
        status: 'TODO',
        dueDate: new Date('2030-05-12T10:00:00.000Z'),
      },
    });

    const response = await request(app)
      .patch(`/tasks/${createdTask.id}/status`)
      .send({ status: 'DONE' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('DONE');
  });

  test('deletes a task', async () => {
    const createdTask = await prisma.task.create({
      data: {
        title: 'Close case note',
        description: null,
        status: 'TODO',
        dueDate: new Date('2030-05-12T10:00:00.000Z'),
      },
    });

    const deleteResponse = await request(app).delete(`/tasks/${createdTask.id}`);

    expect(deleteResponse.status).toBe(204);

    const getResponse = await request(app).get(`/tasks/${createdTask.id}`);

    expect(getResponse.status).toBe(404);
    expect(getResponse.body.message).toBe('Task not found');
  });

  test('returns validation errors for an invalid create request', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({
        title: '',
        status: 'TODO',
        dueDate: '2020-05-12T10:00:00.000Z',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'title', message: 'title is required' }),
        expect.objectContaining({ field: 'dueDate', message: 'dueDate must be in the future' }),
      ])
    );
  });

  test('returns a validation error for an invalid id', async () => {
    const response = await request(app).get('/tasks/not-a-number');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'id', message: 'id must be a positive integer' }),
      ])
    );
  });
});