import { z } from 'zod';

export const programSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  startDate: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Invalid start date',
  }),
  endDate: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Invalid end date',
  }),
  budget: z.preprocess(val => {
    const num = typeof val === 'string' ? Number(val) : val;
    return typeof num === 'number' && !isNaN(num) ? num : undefined;
  }, z.number({ invalid_type_error: 'Budget must be a number' }).nonnegative('Budget cannot be negative')),
  attachment: z.string().optional(),
});

export const updateProgramSchema = programSchema.partial();
