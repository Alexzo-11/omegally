import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // MUST BE HERE
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    title: String,
    price: Number,
    qty: Number,
    image: String,
    size: String,
    color: String
  }],
  totalAmount: { type: Number, required: true },
  amountPaid: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['bank', 'installment', 'instant'], default: 'bank' },
  paymentStatus: { type: String, default: 'pending_review' },
  receiptImage: { type: String },
  bankDetails: {
    bankName: String,
    accountName: String,
    accountNumber: String,
  },
  installmentWeeks: { type: Number, default: 1 },
  landmark: { type: String, default: '' },
  altPhone: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);