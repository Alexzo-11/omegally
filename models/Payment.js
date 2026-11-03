import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  method: { type: String, enum: ['wallet', 'bank', 'card', 'installment'] },
  status: { type: String, enum: ['pending', 'success', 'failed', 'refunded'], default: 'pending' },
  transactionId: String,
  metadata: mongoose.Schema.Types.Mixed,
  refundReason: String,
}, { timestamps: true });

export default mongoose.models.Payment || mongoose.model('Payment', paymentSchema);