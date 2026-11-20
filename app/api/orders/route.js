// app/api/orders/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Order from '@/models/Order';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

export async function GET(req) {
  try {
    await connectToDatabase();
    
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let orders;
    if (user.role === 'admin') {
      // Fetch all orders, populate user details AND product details
      orders = await Order.find()
        .sort({ createdAt: -1 })
        .populate('user', 'name email phone address')
        .populate('items.product', 'category title price')
        .lean(); // .lean() makes it faster and easier to serialize
    } else {
      orders = await Order.find({ user: decoded.id })
        .sort({ createdAt: -1 })
        .populate('items.product', 'category title price')
        .lean();
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('GET Orders API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const body = await req.json();
    const { items, totalAmount, amountPaid, paymentMethod, weeks, receiptDataUrl, bankDetails, landmark, altPhone, note } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in order' }, { status: 400 });
    }

    const order = new Order({
      user: decoded.id,
      items: items.map((i) => ({
        product: i.productId,
        title: i.title,
        price: i.price,
        qty: i.qty,
        image: i.image,
        size: i.size || '',
        color: i.color || '',
      })),
      totalAmount,
      amountPaid,
      paymentMethod: paymentMethod === 'installment' ? 'installment' : 'bank',
      paymentStatus: 'pending_review',
      receiptImage: receiptDataUrl,
      bankDetails,
      installmentWeeks: weeks || 1,
      landmark: landmark || '',
      altPhone: altPhone || '',
      note: note || '',
    });

    await order.save();

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}