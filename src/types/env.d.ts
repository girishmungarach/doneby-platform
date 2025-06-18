declare namespace NodeJS {
  interface ProcessEnv {
    // Supabase Configuration
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;

    // Application Configuration
    NEXT_PUBLIC_APP_URL: string;
    NODE_ENV: 'development' | 'production' | 'test';
    
    // Authentication
    AUTH_SECRET: string;
    AUTH_TRUST_HOST: string;
    
    // API Keys (add as needed)
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?: string;
    
    // Feature Flags
    NEXT_PUBLIC_ENABLE_ANALYTICS: string;
    NEXT_PUBLIC_ENABLE_FEATURE_X: string;
    
    // External Services
    NEXT_PUBLIC_SENTRY_DSN?: string;
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string;
    STRIPE_SECRET_KEY?: string;
    
    // Email Configuration
    SMTP_HOST?: string;
    SMTP_PORT?: string;
    SMTP_USER?: string;
    SMTP_PASSWORD?: string;
    SMTP_FROM_EMAIL?: string;
  }
} 