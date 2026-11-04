// app/api/orders/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Order from '@/models/Order';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import nodemailer from 'nodemailer';

// ... GET handler as-is

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

    const order = new Order({
      user: decoded.id,
      items: items.map((i) => ({
        product: i.productId,
        title: i.title,
        price: i.price,
        qty: i.qty,
        image: i.image,
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

    // --- EMAIL NOTIFICATION ---
    try {
      const user = await User.findById(decoded.id);
      if (user?.email) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

        const isInstallment = order.paymentMethod === 'installment';
        const balance = order.totalAmount - order.amountPaid;
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const receiptUrl = `${appUrl}/receipt/${order._id}`;

        await transporter.sendMail({
          from: `"Omegally" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: `Order Confirmation #${order._id.slice(-6).toUpperCase()}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #2563EB;">Thank you for your order!</h2>
              <p>Hi ${user.name},</p>
              <p>Your order <strong>#${order._id.slice(-6).toUpperCase()}</strong> has been received and is being processed.</p>
              
              <div style="background:#f5f5f5; padding:16px; border-radius:8px; margin:20px 0;">
                <p style="margin:4px 0;"><strong>Total Amount:</strong> ₦${order.totalAmount.toLocaleString()}</p>
                <p style="margin:4px 0;"><strong>Amount Paid:</strong> ₦${order.amountPaid.toLocaleString()}</p>
                ${isInstallment && balance > 0 ? `<p style="margin:4px 0; color:#F59E0B;"><strong>Remaining Balance:</strong> ₦${balance.toLocaleString()}</p>` : ''}
              </div>

              <p style="text-align:center; margin:24px 0;">
                <a href="${receiptUrl}" style="background:#2563EB; color:#fff; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:bold;">View Your Receipt</a>
              </p>

              <p style="color:#666; font-size:0.9rem;">If you have any questions, reply to this email or contact us at support@omegally.com.</p>
              <p style="color:#666; font-size:0.9rem;">— The Omegally Team</p>
            </div>
          `,
        });
      }
    } catch (emailErr) {
      console.error('Order email failed:', emailErr.message);
      // Don't fail the order if email fails
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }
}