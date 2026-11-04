import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Order from '@/models/Order';
import { withAdmin } from '@/middleware/auth';

export const PUT = withAdmin(async (req, { params }) => {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();

    // Allow updating paymentStatus (e.g. 'paid', 'delivered', 'failed')
    const order = await Order.findByIdAndUpdate(id, body, { new: true });
    const order = await Order.findById(id).populate('user', 'name email phone');
    
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json(order);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
});