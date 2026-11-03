// app/api/auth/forgot-password/route.js
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';

export async function POST(req) {
  try {
    const { email } = await req.json();
    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      // For security, don't reveal if the email exists or not
      return NextResponse.json({ message: 'If that email exists, a reset link was sent.' }, { status: 200 });
    }

    // Generate a random token and set expiration to 1 hour
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Create the reset URL (fallback to localhost if env is missing)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetUrl = `${appUrl}/reset-password?token=${token}`;

    // Setup Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Omegally Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Reset Your Password</h2>
          <p>You requested a password reset for your Omegally account.</p>
          <p>Click the link below to set a new password. This link is valid for 1 hour.</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #2563EB; color: #fff; text-decoration: none; border-radius: 8px; margin: 16px 0;">Reset Password</a>
          <p>If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Reset link sent to your email.' }, { status: 200 });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}