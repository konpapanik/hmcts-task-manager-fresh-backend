# HMCTS Task Manager Fresh Backend

Simple Express + TypeScript + Prisma backend for the HMCTS task manager test.

## Stack

- Node.js
- TypeScript
- Express
- Prisma
- SQLite
- Zod
- Jest
- Supertest

## Features

- Create task
- Get all tasks
- Get task by id
- Update task status
- Delete task
- Request validation
- Centralized error handling

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment file if needed:

```bash
cp .env.example .env
```

3. Run the Prisma migration:

```bash
npm run prisma:migrate
```

4. Start the backend:

```bash
npm run dev
```

The API runs on `http://localhost:4000`.

Swagger UI is available at `http://localhost:4000/api-docs`.

The raw OpenAPI JSON is available at `http://localhost:4000/api-docs.json`.

## Frontend connection

The frontend is expected to call this backend at `http://localhost:4000`.

In the frontend project, the task API client defaults to:

```ts
process.env.TASKS_API_URL || 'http://localhost:4000'
```

So if both apps are running locally with default settings, they connect automatically.

## API endpoints

- `GET /health`
- `GET /api-docs`
- `GET /api-docs.json`
- `POST /tasks`
- `GET /tasks`
- `GET /tasks/:id`
- `PATCH /tasks/:id/status`
- `DELETE /tasks/:id`

## Example create request

```json
{
  "title": "Prepare hearing bundle",
  "description": "Collect the final chronology",
  "status": "TODO",
  "dueDate": "2030-05-12T10:00:00.000Z"
}
```

## Validation

The API validates:

- title is required
- title max length 100
- description max length 500
- status must be `TODO`, `IN_PROGRESS`, or `DONE`
- due date must be a valid ISO date-time string
- due date must be in the future
- route ids must be positive integers

Validation failures return a `400` response with a `message` and field-level `errors` array.

## Tests

Run:

```bash
npm test
```

The tests cover the main CRUD flow plus validation errors.