import { ZodError } from 'zod';

export const formatZodError = (error: ZodError) => {
  const formatted: Record<string, string> = {};
  for (const err of error.errors) {
    const field = err.path[0] as string;
    formatted[field] = err.message;
  }
  return formatted;
};
