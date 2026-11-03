import mongoose from 'mongoose';

const installmentPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  totalAmount: { type: Number, required: true },
  downPayment: { type: Number, default: 0 },
  remaining: { type: Number, required: true },
  installmentCount: { type: Number, required: true },
  installmentAmount: { type: Number, required: true },
  frequency: { type: String, enum: ['weekly', 'biweekly', 'monthly', 'custom'], default: 'monthly' },
  startDate: { type: Date, default: Date.now },
  nextPaymentDate: { type: Date },
  endDate: { type: Date },
  status: { type: String, enum: ['active', 'completed', 'defaulted'], default: 'active' },
  payments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InstallmentPayment' }],
  missedPayments: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.InstallmentPlan || mongoose.model('InstallmentPlan', installmentPlanSchema);