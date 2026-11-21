// app/api/orders/[id]/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Order from '@/models/Order';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import { sendReceiptEmail } from '@/lib/sendEmail';

// GET single order
export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const order = await Order.findById(id).populate('user', 'name email phone address');
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    return NextResponse.json(order);
  } catch (error) {
    console.error('GET Order Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: update order (status, etc.)
export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    // 1. Authenticate Admin
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const user = await User.findById(decoded.id);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json();

    // 2. Find Order
    const order = await Order.findById(id).populate('user', 'email name');
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    // 3. Update Fields (Only if provided)
    if (body.paymentStatus !== undefined) {
      const isBecomingPaid = body.paymentStatus === 'paid' && order.paymentStatus !== 'paid';
      order.paymentStatus = body.paymentStatus;

      // Auto-send receipt if status just changed to 'paid'
      if (isBecomingPaid && order.user?.email) {
        try {
          await sendReceiptEmail({ to: order.user.email, order });
        } catch (err) {
          console.error('Auto-receipt failed:', err.message);
        }
      }
    }
    
    if (body.amountPaid !== undefined) order.amountPaid = body.amountPaid;
    if (body.receiptImage !== undefined) order.receiptImage = body.receiptImage;

    await order.save();

    return NextResponse.json(order);
  } catch (error) {
    console.error('PUT Order Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}