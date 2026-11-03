import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  balance: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WalletTransaction' }],
}, { timestamps: true });

export default mongoose.models.Wallet || mongoose.model('Wallet', walletSchema);