import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { connectToDatabase } from '@/lib/mongoose';
import User from '@/models/User';

/**
 * Protect a route — requires a valid JWT.
 * Attaches `req.user = { id }` from the token payload.
 */
export function withAuth(handler) {
  return async (req, context) => {
    const authHeader = req.headers.get('authorization');
    const token =
      authHeader?.split(' ')[1] ||
      req.cookies?.get?.('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    req.user = { id: decoded.id };
    return handler(req, context);
  };
}

/**
 * Admin-only route — requires a valid JWT AND the user's role === 'admin'.
 * Attaches `req.user = { id, role: 'admin' }`.
 */
export function withAdmin(handler) {
  return withAuth(async (req, context) => {
    await connectToDatabase();
    const user = await User.findById(req.user.id).select('role');
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 });
    }
    req.user.role = 'admin';
    return handler(req, context);
  });
}