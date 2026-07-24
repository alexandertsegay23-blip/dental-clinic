import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that don't require authentication
const publicRoutes = ['/manage/login', '/admin/login', '/api/manage/login', '/api/admin/login'];

// Routes that require authentication
const adminRoutes = ['/manage', '/admin', '/api/manage', '/api/admin'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Add security headers to all responses
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://embed.tawk.to; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' https://*.tawk.to https://embed.tawk.to https://api.afromessage.com https://api.afromessage.com/api; frame-src 'self' https://www.google.com https://www.google.com/maps https://www.google.com/maps/embed https://embed.tawk.to;"
  );

  // Check if it's an admin route
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname === route);
  const isApiRoute = pathname.startsWith('/api/');

  if (!isAdminRoute) {
    return response;
  }

  // For public admin routes (login page), allow access
  if (isPublicRoute) {
    return response;
  }

  // Return 404 for /admin paths to hide the /manage route
  if (pathname.startsWith('/admin') && !pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Check for admin session cookie
  const sessionCookie = request.cookies.get('admin_session');

  if (!sessionCookie) {
    // Not logged in - for API routes return 401, for pages redirect to login
    if (isApiRoute) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const loginUrl = new URL('/manage/login', request.url);
    loginUrl.searchParams.set('redirect', pathname.replace('/admin', '/manage'));
    return NextResponse.redirect(loginUrl);
  }

  // Session exists - allow access
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|.*\\..*$).*)',
  ],
};
