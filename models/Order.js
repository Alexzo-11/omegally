import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    title: String,
    price: Number,
    qty: Number,
    image: String,
    size: { type: String, default: '' },  // Added
    color: { type: String, default: '' }, // Added
    landmark: { type: String, default: '' },
altPhone: { type: String, default: '' },
  }],
  totalAmount: { type: Number, required: true },
  amountPaid: { type: Number, default: 0 },
  paymentMethod: { type: String, enum: ['instant', 'installment', 'bank'] },
  paymentStatus: { 
    type: String, 
    enum: ['pending_review', 'paid', 'failed', 'delivered', 'cancelled'], 
    default: 'pending_review' 
  },
  receiptImage: String,
  bankDetails: {
    bankName: String,
    accountName: String,
    accountNumber: String,
  },
  installmentWeeks: { type: Number, default: 1 },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', orderSchema);