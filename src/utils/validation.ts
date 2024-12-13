import { z } from 'zod';

export const emailSchema = z.string().email('Invalid email address');
export const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');
export const nameSchema = z.string().min(2, 'Name must be at least 2 characters');

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = z.object({
  displayName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: passwordSchema
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});