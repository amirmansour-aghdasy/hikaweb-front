import { NextResponse } from 'next/server';

export function middleware(request) {
  const accessToken = request.cookies.get('accessToken');
  const refreshToken = request.cookies.get('refreshToken');
  const pathname = request.nextUrl.pathname;
  const siteType = process.env.NEXT_PUBLIC_SITE_TYPE;

  // Public paths that don't require authentication
  const publicPaths = ['/auth/login', '/auth/callback', '/auth/error', '/'];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // Check authentication
  const isAuthenticated = !!(accessToken || refreshToken);

  // Admin dashboard specific logic
  if (siteType === 'admin') {
    if (!isAuthenticated && !isPublicPath) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Main site logic
  if (siteType === 'main') {
    // Protected paths on main site
    const protectedPaths = ['/dashboard', '/profile'];
    const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
    
    if (isProtectedPath && !isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Redirect authenticated users away from login
  if (pathname === '/auth/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};