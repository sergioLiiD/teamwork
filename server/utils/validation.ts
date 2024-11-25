import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const workspaceSchema = z.object({
  name: z.string().min(2, 'Workspace name must be at least 2 characters'),
});

export const workflowSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  type: z.string(),
  workspaceId: z.string().uuid(),
});

export const stepSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  type: z.enum(['video', 'document', 'quiz', 'checklist']),
  content: z.any(),
  dueInDays: z.number().min(1),
});

export const validateRegistration = (data: unknown) => registerSchema.parse(data);
export const validateLogin = (data: unknown) => loginSchema.parse(data);
export const validateWorkspace = (data: unknown) => workspaceSchema.parse(data);
export const validateWorkflow = (data: unknown) => workflowSchema.parse(data);
export const validateStep = (data: unknown) => stepSchema.parse(data);