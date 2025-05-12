import { z } from 'zod';

export const participantSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  age: z.number().int().positive('Age must be a positive number'),
  joinedDate: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Invalid joined date',
  }),
  program: z.number().int().positive('Program ID must be a valid number'),
});

export const participantUpdateSchema = participantSchema.partial();
