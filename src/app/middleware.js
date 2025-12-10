import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.hikaweb.ir/api/v1';

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const siteType = process.env.NEXT_PUBLIC_SITE_TYPE;

  // Skip maintenance check for maintenance page itself and API routes
  if (pathname === '/maintenance' || pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  // Check maintenance mode for main site only
  // Use minimal cache (5 seconds) to ensure quick updates while reducing API calls
  if (siteType === 'main') {
    try {
      const maintenanceResponse = await fetch(`${API_URL}/settings/maintenance`, {
        next: { revalidate: 5 }, // Cache for 5 seconds for faster updates
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (maintenanceResponse.ok) {
        const data = await maintenanceResponse.json();
        const maintenance = data.data?.maintenance;

        if (maintenance?.enabled) {
          // Get client IP (if available from headers)
          // x-forwarded-for can contain multiple IPs separated by commas (client, proxy1, proxy2)
          // We need the first IP which is the original client IP
          const forwardedFor = request.headers.get('x-forwarded-for');
          const realIP = request.headers.get('x-real-ip');
          
          let clientIP = 'unknown';
          if (forwardedFor) {
            // Take the first IP from the list
            clientIP = forwardedFor.split(',')[0].trim();
          } else if (realIP) {
            clientIP = realIP.trim();
          }
          
          // Check if IP is allowed
          const allowedIPs = maintenance.allowedIPs || [];
          
          // If allowedIPs is empty, no one is allowed (maintenance mode blocks everyone)
          // If allowedIPs has values, check if current IP is in the list
          const isIPAllowed = allowedIPs.length > 0 && allowedIPs.includes(clientIP);

          // Redirect to maintenance page if IP is not allowed
          if (!isIPAllowed && pathname !== '/maintenance') {
            return NextResponse.redirect(new URL('/maintenance', request.url));
          }
        }
      }
    } catch (error) {
      // If API call fails, continue normally (don't block site)
      // This ensures the site remains accessible even if the API is down
      console.error('Maintenance check error:', error);
    }
  }

  const accessToken = request.cookies.get('accessToken');
  const refreshToken = request.cookies.get('refreshToken');

  // Public paths that don't require authentication
  const publicPaths = ['/auth', '/auth/login', '/auth/callback', '/auth/error', '/', '/maintenance'];
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
      return NextResponse.redirect(new URL('/auth', request.url));
    }
  }

  // Redirect authenticated users away from login
  if ((pathname === '/auth' || pathname === '/auth/login') && isAuthenticated) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};