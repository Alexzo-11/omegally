// app/api/orders/[id]/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Order from '@/models/Order';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

// GET single order
export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const order = await Order.findById(id).populate('user', 'name email phone address');
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: update order (status, etc.)
export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

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

    // Only allow safe fields to be updated
    const allowedUpdates = {
      paymentStatus: body.paymentStatus,
      amountPaid: body.amountPaid,
      receiptImage: body.receiptImage,
    };
    Object.keys(allowedUpdates).forEach(k => allowedUpdates[k] === undefined && delete allowedUpdates[k]);

    const order = await Order.findByIdAndUpdate(id, allowedUpdates, { new: true })
      .populate('user', 'name email phone address');

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}