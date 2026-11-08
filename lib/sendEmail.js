import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

// 1. Order Confirmation Email (existing)
export async function sendOrderConfirmationEmail({ to, customerName, orderId, totalAmount, amountPaid, paymentMethod, items }) {
  try {
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${item.title} × ${item.qty}</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">₦${(item.price * item.qty).toLocaleString()}</td>
      </tr>
    `).join('');

    const html = `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 40px 20px;">
        <div style="background: #fff; border-radius: 16px; padding: 32px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #2563EB; margin: 0; font-size: 24px;">Omegally</h1>
            <p style="color: #64748B; font-size: 14px;">Shop Smarter, Live Better</p>
          </div>
          <h2 style="color: #0F172A; font-size: 20px;">Hi ${customerName},</h2>
          <p style="color: #475569; font-size: 15px;">Thank you for your order! We've received your payment receipt and will verify it within 24 hours.</p>
          
          <div style="background: #F1F5F9; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <p style="margin: 4px 0; color: #475569;"><strong>Order ID:</strong> #${orderId.slice(-6).toUpperCase()}</p>
            <p style="margin: 4px 0; color: #475569;"><strong>Payment Method:</strong> ${paymentMethod === 'installment' ? 'Installment Plan' : 'Full Payment'}</p>
            <p style="margin: 4px 0; color: #475569;"><strong>Total Amount:</strong> ₦${totalAmount.toLocaleString()}</p>
            <p style="margin: 4px 0; color: #475569;"><strong>Amount Paid:</strong> ₦${amountPaid.toLocaleString()}</p>
          </div>

          <h3 style="color: #0F172A; font-size: 16px; margin-top: 24px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${itemsHtml}
          </table>

          <p style="color: #475569; font-size: 14px; margin-top: 24px;">We'll send you another email once your order is confirmed and shipped.</p>
          <p style="color: #64748B; font-size: 12px; margin-top: 32px; border-top: 1px solid #eee; padding-top: 16px;">Questions? Reply to this email or WhatsApp us at +234 800 000 0000.</p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: to,
      subject: `Order #${orderId.slice(-6).toUpperCase()} Received — Omegally`,
      html: html,
    });

    console.log('Order email sent to:', to);
  } catch (err) {
    console.error('Email send failed:', err);
  }
}

// 2. NEW: Send Receipt Email (triggers from Admin)
export async function sendReceiptEmail({ to, order }) {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://omegally.vercel.app';
    const receiptUrl = `${appUrl}/receipt/${order._id}`;
    const isInstallment = order.paymentMethod === 'installment';
    const balanceDue = order.totalAmount - order.amountPaid;

    const html = `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 40px 20px;">
        <div style="background: #fff; border-radius: 16px; padding: 32px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #2563EB; margin: 0; font-size: 24px;">Omegally</h1>
            <p style="color: #64748B; font-size: 14px;">Payment Receipt</p>
          </div>
          <h2 style="color: #0F172A; font-size: 20px;">Payment Confirmed!</h2>
          <p style="color: #475569; font-size: 15px;">Your payment has been verified and confirmed. Here are your receipt details:</p>
          
          <div style="background: #F1F5F9; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <p style="margin: 4px 0; color: #475569;"><strong>Order ID:</strong> #${order._id.slice(-6).toUpperCase()}</p>
            <p style="margin: 4px 0; color: #475569;"><strong>Total Amount:</strong> ₦${order.totalAmount.toLocaleString()}</p>
            <p style="margin: 4px 0; color: #475569;"><strong>Amount Paid:</strong> ₦${order.amountPaid.toLocaleString()}</p>
            ${isInstallment && balanceDue > 0 ? `<p style="margin: 4px 0; color: #D97706;"><strong>Remaining Balance:</strong> ₦${balanceDue.toLocaleString()}</p>` : ''}
          </div>

          <div style="text-align: center; margin-top: 32px;">
            <a href="${receiptUrl}" style="background: #2563EB; color: #fff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
              View Full Receipt
            </a>
          </div>

          <p style="color: #64748B; font-size: 12px; margin-top: 32px; border-top: 1px solid #eee; padding-top: 16px; text-align: center;">
            Thank you for shopping with Omegally.
          </p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: to,
      subject: `Receipt for Order #${order._id.slice(-6).toUpperCase()} — Omegally`,
      html: html,
    });

    console.log('Receipt email sent to:', to);
  } catch (err) {
    console.error('Receipt Email send failed:', err);
    throw new Error('Failed to send receipt email');
  }
}