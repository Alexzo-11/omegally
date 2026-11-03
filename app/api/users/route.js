import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import User from '@/models/User';
import { withAdmin } from '@/middleware/auth';

export const GET = withAdmin(async () => {
  try {
    await connectToDatabase();
    // Fetch all users, exclude passwords
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return NextResponse.json({ users });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
});