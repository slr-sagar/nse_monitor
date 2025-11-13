import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get session cookie
  const session = request.cookies.get('nse_dashboard_session');

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/api/auth/login'];
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));

  // Allow access to public paths and API routes
  if (isPublicPath || request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Redirect to login if no session and trying to access protected routes
  if (!session && request.nextUrl.pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
