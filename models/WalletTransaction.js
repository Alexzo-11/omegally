import mongoose from 'mongoose';

const walletTransactionSchema = new mongoose.Schema({
  wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  description: String,
  reference: String,
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
}, { timestamps: true });

export default mongoose.models.WalletTransaction || mongoose.model('WalletTransaction', walletTransactionSchema);