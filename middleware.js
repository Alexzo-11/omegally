import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

// List of public routes (no auth required)
const publicRoutes = ['/', '/login', '/register', '/api/auth/login', '/api/auth/register'];

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check token for protected routes
  const token = req.headers.get('authorization')?.split(' ')[1] ||
                req.cookies.get('token')?.value;

  if (!token) {
    // Redirect to login if not API
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Attach user to request (for API routes) or just proceed
  const response = NextResponse.next();
  response.headers.set('x-user-id', decoded.id);
  return response;
}

// Only run middleware on specific paths
export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*', '/products/:path*'],
};

