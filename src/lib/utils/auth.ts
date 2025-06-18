import { ROUTE_CONFIG, type RouteConfig, type UserRole } from '@/lib/types/auth';

export function getRouteConfig(pathname: string): RouteConfig | undefined {
  // Find the most specific matching route
  const matchingRoute = Object.entries(ROUTE_CONFIG)
    .filter(([route]) => pathname.startsWith(route))
    .sort(([a], [b]) => b.length - a.length)[0];

  return matchingRoute ? matchingRoute[1] : undefined;
}

export function hasRequiredRole(userRole: UserRole | undefined, requiredRoles?: UserRole[]): boolean {
  if (!requiredRoles || !userRole) return false;
  return requiredRoles.includes(userRole);
}

export function getRedirectPath(pathname: string, isAuthenticated: boolean, userRole?: UserRole): string {
  const routeConfig = getRouteConfig(pathname);

  // If no route config found, treat as protected
  if (!routeConfig) {
    return isAuthenticated ? pathname : '/login';
  }

  // Handle public routes
  if (routeConfig.type === 'public') {
    return isAuthenticated ? '/dashboard' : pathname;
  }

  // Handle protected routes
  if (routeConfig.type === 'protected') {
    return isAuthenticated ? pathname : '/login';
  }

  // Handle admin routes
  if (routeConfig.type === 'admin') {
    if (!isAuthenticated) return '/login';
    if (!hasRequiredRole(userRole, routeConfig.roles)) return '/dashboard';
    return pathname;
  }

  // Default fallback
  return '/login';
}

export function isPublicRoute(pathname: string): boolean {
  const routeConfig = getRouteConfig(pathname);
  return routeConfig?.type === 'public';
}

export function isProtectedRoute(pathname: string): boolean {
  const routeConfig = getRouteConfig(pathname);
  return routeConfig?.type === 'protected';
}

export function isAdminRoute(pathname: string): boolean {
  const routeConfig = getRouteConfig(pathname);
  return routeConfig?.type === 'admin';
} 