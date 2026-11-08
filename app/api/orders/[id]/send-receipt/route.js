import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Order from '@/models/Order';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import { sendReceiptEmail } from '@/lib/sendEmail';

export async function POST(req, { params }) {
  try {
    await connectToDatabase();
    
    // Next.js 15+ requires awaiting params
    const { id } = await params;

    // 1. Verify Admin Authentication
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized - No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const admin = await User.findById(decoded.id);
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied. Admin privileges required.' }, { status: 403 });
    }

    // 2. Fetch Order and Customer Email
    const order = await Order.findById(id).populate('user', 'name email');
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (!order.user || !order.user.email) {
      return NextResponse.json({ error: 'Customer has no email address on file' }, { status: 400 });
    }

    // 3. Send the Email using Resend
    await sendReceiptEmail({ 
      to: order.user.email, 
      order: order 
    });

    return NextResponse.json({ 
      message: 'Receipt email sent successfully',
      sentTo: order.user.email 
    });

  } catch (error) {
    console.error('Send Receipt API Error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to send receipt email' 
    }, { status: 500 });
  }
}