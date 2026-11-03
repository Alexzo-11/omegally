import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import InstallmentPlan from '@/models/InstallmentPlan';
import { withAuth } from '@/middleware/auth';

export const POST = withAuth(async (req) => {
  await connectToDatabase();
  const body = await req.json();
  const plan = new InstallmentPlan({ ...body, userId: req.user.id });
  await plan.save();
  return NextResponse.json(plan, { status: 201 });
});