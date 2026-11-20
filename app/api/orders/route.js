// app/api/orders/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Order from '@/models/Order';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import { sendOrderConfirmationEmail } from '@/lib/sendEmail';

export async function POST(req) {
  try {
    await connectToDatabase();
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const body = await req.json();
    const { items, totalAmount, amountPaid, paymentMethod, weeks, receiptDataUrl, bankDetails, landmark, altPhone } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in order' }, { status: 400 });
    }

    // 1. Create and Save Order
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
    });

    await order.save();

    // 2. Send Email (Safely - won't crash order if it fails)
    try {
      const user = await User.findById(decoded.id);
      if (user?.email) {
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
    } catch (emailErr) {
      console.error('Order saved, but email failed:', emailErr.message);
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Order POST Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }
}