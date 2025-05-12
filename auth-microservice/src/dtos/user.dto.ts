import { z } from 'zod';

// DTO for login
export const LoginUserDto = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(5, { message: 'String must contain at least 5 character(s)' }),
});

// DTO for registration
export const RegisterUserDto = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  password: z.string().min(5, { message: 'Password must be at least 5 characters' }),
  role: z.enum(['admin', 'participant']).optional(), // Optional: default to 'participant'
});

// DTO for requesting a password reset
export const RequestPasswordResetDto = z.object({
  email: z.string().email({ message: 'Invalid email' }),
});

// DTO for resetting the password
export const ResetPasswordDto = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(5, { message: 'String must contain at least 5 character(s)' }),
});
