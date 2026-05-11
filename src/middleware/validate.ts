import { RequestHandler } from 'express';
import { ZodTypeAny } from 'zod';

type RequestTarget = 'body' | 'params' | 'query';

export function validate(schema: ZodTypeAny, target: RequestTarget): RequestHandler {
  return (req, _res, next) => {
    const parsed = schema.parse(req[target]);
    req[target] = parsed;
    next();
  };
}