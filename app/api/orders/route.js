import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Order from '@/models/Order';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import { withAdmin } from '@/middleware/auth';
import { sendOrderConfirmationEmail } from '@/lib/sendEmail';
import User from '@/models/User';


// GET: Fetch orders (User sees own, Admin sees all)
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
      orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'name email phone');
    } else {
      orders = await Order.find({ user: decoded.id }).sort({ createdAt: -1 });
    }

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create a new order
export async function POST(req) {
  try {
    await connectToDatabase();
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const body = await req.json();
    const { items, totalAmount, amountPaid, paymentMethod, weeks, receiptDataUrl, bankDetails } = body;

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
        size: i.size || '',   // 👈 Now saving Size
        color: i.color || '', // 👈 Now saving Color
      })),
      totalAmount,
      amountPaid,
      paymentMethod: paymentMethod === 'installment' ? 'installment' : 'bank',
      paymentStatus: 'pending_review',
      receiptImage: receiptDataUrl,
      bankDetails,
      installmentWeeks: weeks || 1,
    });

    await order.save();

    // Fetch user to get their email and name
const user = await User.findById(decoded.id);
if (user && user.email) {
  await sendOrderConfirmationEmail({
    to: user.email,
    customerName: user.name,
    orderId: order._id.toString(),
    totalAmount: totalAmount,
    amountPaid: amountPaid,
    paymentMethod: paymentMethod,
    items: items,
  });
}
    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }
}