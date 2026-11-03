import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Order from '@/models/Order';
import { withAuth } from '@/middleware/auth';

export const GET = withAuth(async (req) => {
  await connectToDatabase();
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  return NextResponse.json({ orders });
});