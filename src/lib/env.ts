import { z } from 'zod';

const envSchema = z.object({
  // Supabase Configuration
  DONEBY_PUBLIC_SUPABASE_URL: z.string().url().min(1),
  DONEBY_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // Application Configuration
  DONEBY_PUBLIC_APP_URL: z.string().url().min(1),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  
  // Authentication
  AUTH_SECRET: z.string().min(1),
  AUTH_TRUST_HOST: z.string().min(1),
  
  // API Keys
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().optional(),
  
  // Feature Flags
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.string().transform((val) => val === 'true').default('false'),
  NEXT_PUBLIC_ENABLE_FEATURE_X: z.string().transform((val) => val === 'true').default('false'),
  
  // External Services
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  
  // Email Configuration
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM_EMAIL: z.string().email().optional(),
});

/**
 * Validate environment variables at runtime
 */
export function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((err) => err.path.join('.'))
        .join(', ');
      throw new Error(`Missing or invalid environment variables: ${missingVars}`);
    }
    throw error;
  }
}

/**
 * Get environment variables with type safety
 */
export function getEnv() {
  return validateEnv();
}

/**
 * Check if we're in development mode
 */
export function isDev() {
  return process.env.NODE_ENV === 'development';
}

/**
 * Check if we're in production mode
 */
export function isProd() {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if we're in test mode
 */
export function isTest() {
  return process.env.NODE_ENV === 'test';
}

/**
 * Get the base URL for the application
 */
export function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  const env = getEnv();
  return env.DONEBY_PUBLIC_APP_URL;
}

/**
 * Get feature flag value
 */
export function getFeatureFlag(flag: keyof typeof envSchema.shape) {
  const env = getEnv();
  return env[flag];
} 