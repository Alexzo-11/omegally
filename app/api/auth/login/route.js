import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import User from '@/models/User';
import { signToken } from '@/lib/jwt';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(req) {
  // 👇 Apply Rate Limit (5 attempts per minute per IP)
  const { success, limit, remaining, resetTime } = rateLimit(req, 5, 60000);
  
  if (!success) {
    return NextResponse.json(
      { error: `Too many login attempts. Please try again after ${new Date(resetTime).toLocaleTimeString()}.` },
      { status: 429 }
    );
  }

  try {
    await connectToDatabase();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = signToken(user._id);

    return NextResponse.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}