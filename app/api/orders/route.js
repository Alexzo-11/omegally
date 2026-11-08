// app/api/orders/route.js (GET Handler)
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Order from '@/models/Order';
import User from '@/models/User';
import Product from '@/models/Product'; // Add this import
import { verifyToken } from '@/lib/jwt';

export async function GET(req) {
  try {
    await connectToDatabase();
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const user = await User.findById(decoded.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    let orders;
    if (user.role === 'admin') {
      // ✅ FIX: Populate the user AND the items.product (so we get the category)
      orders = await Order.find()
        .sort({ createdAt: -1 })
        .populate('user', 'name email phone address')
        .populate('items.product', 'category title price'); // <-- Crucial fix
    } else {
      orders = await Order.find({ user: decoded.id })
        .sort({ createdAt: -1 })
        .populate('items.product', 'category title price');
    }

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}