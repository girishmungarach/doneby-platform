export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export type RouteType = 'public' | 'protected' | 'admin';

export interface RouteConfig {
  type: RouteType;
  roles?: UserRole[];
}

export const ROUTE_CONFIG: Record<string, RouteConfig> = {
  // Public routes
  '/': { type: 'public' },
  '/login': { type: 'public' },
  '/signup': { type: 'public' },
  '/reset-password': { type: 'public' },
  '/update-password': { type: 'public' },
  '/auth/callback': { type: 'public' },

  // Protected routes
  '/dashboard': { type: 'protected' },
  '/profile': { type: 'protected' },
  '/verifications': { type: 'protected' },
  '/jobs': { type: 'protected' },
  '/settings': { type: 'protected' },

  // Admin routes
  '/admin': { type: 'admin', roles: ['admin'] },
  '/admin/users': { type: 'admin', roles: ['admin'] },
  '/admin/verifications': { type: 'admin', roles: ['admin'] },
  '/admin/settings': { type: 'admin', roles: ['admin'] },
}; 