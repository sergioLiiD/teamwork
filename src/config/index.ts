import { z } from 'zod';

const envSchema = z.object({
  // Application
  MODE: z.enum(['development', 'production']).default('development'),
  BASE_URL: z.string().default('/'),
  API_URL: z.string().url(),
  APP_NAME: z.string().default('OnboardFlow'),
  APP_VERSION: z.string().default('1.0.0'),

  // Email settings
  EMAIL_FROM: z.string().email().optional(),
  EMAIL_FROM_NAME: z.string().optional(),
});

const validateEnv = () => {
  try {
    return envSchema.parse({
      MODE: import.meta.env.MODE,
      BASE_URL: import.meta.env.BASE_URL,
      API_URL: import.meta.env.VITE_API_URL,
      APP_NAME: import.meta.env.VITE_APP_NAME,
      APP_VERSION: import.meta.env.VITE_APP_VERSION,
      EMAIL_FROM: import.meta.env.VITE_EMAIL_FROM,
      EMAIL_FROM_NAME: import.meta.env.VITE_EMAIL_FROM_NAME,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => err.path.join('.'));
      console.error(`Missing or invalid environment variables: ${missingVars.join(', ')}`);
      throw new Error('Invalid environment configuration');
    }
    throw error;
  }
};

export const config = validateEnv();