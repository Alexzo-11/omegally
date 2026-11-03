import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Order from '@/models/Order';
import { withAuth } from '@/middleware/auth';

export const POST = withAuth(async (req) => {
  try {
    await connectToDatabase();
    const body = await req.json();

    const {
      items,
      totalAmount,
      amountPaid,
      paymentMethod,
      weeks,
      receiptDataUrl,
      bankDetails,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in order' }, { status: 400 });
    }
    if (!receiptDataUrl) {
      return NextResponse.json({ error: 'Receipt required' }, { status: 400 });
    }

    const order = new Order({
      user: req.user.id,
      items: items.map((i) => ({
        product: i.productId || null,
        name: i.title,
        price: i.price,
        quantity: i.qty,
        image: i.image,
      })),
      totalAmount,
      paymentMethod: paymentMethod === 'installment' ? 'installment' : 'bank',
      paymentStatus: 'pending_review',
      orderStatus: 'processing',
      receiptImage: receiptDataUrl,
      bankDetails,
      installmentWeeks: weeks || 1,
      amountPaid,
    });

    await order.save();

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Order submission error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit order' },
      { status: 500 }
    );
  }
});