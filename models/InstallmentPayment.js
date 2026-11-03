import mongoose from 'mongoose';

const installmentPaymentSchema = new mongoose.Schema({
  plan: { type: mongoose.Schema.Types.ObjectId, ref: 'InstallmentPlan', required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  paidDate: { type: Date },
  status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
  transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
}, { timestamps: true });

export default mongoose.models.InstallmentPayment || mongoose.model('InstallmentPayment', installmentPaymentSchema);