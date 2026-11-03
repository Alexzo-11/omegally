import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Order from '@/models/Order';
import Payment from '@/models/Payment';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(req) {
  try {
    const { reference } = await req.json();

    if (!reference) {
      return NextResponse.json(
        { error: 'Reference is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!data.status) {
      return NextResponse.json(
        { error: data.message || 'Verification failed' },
        { status: 400 }
      );
    }

    // Save payment record
    await connectToDatabase();
    
    const payment = new Payment({
      user: data.data.metadata?.userId || null,
      amount: data.data.amount / 100,
      currency: 'NGN',
      method: 'paystack',
      status: data.data.status,
      transactionId: data.data.reference,
      metadata: data.data,
    });
    await payment.save();

    // If there's an order associated, update it
    if (data.data.metadata?.orderId) {
      await Order.findByIdAndUpdate(data.data.metadata.orderId, {
        paymentStatus: 'paid',
        payment: payment._id,
      });
    }

    return NextResponse.json({
      status: true,
      data: data.data,
    });
  } catch (error) {
    console.error('Paystack verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}