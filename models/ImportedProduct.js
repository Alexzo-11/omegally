import mongoose from 'mongoose';

const importedProductSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  website: { type: String, required: true },
  title: { type: String, required: true },
  image: String,
  price: Number,
  currency: String,
  description: String,
  deliveryFee: { type: Number, default: 0 },
  deliveryInfo: String,
  status: { type: String, enum: ['pending', 'saved', 'purchased'], default: 'pending' },
  dateSaved: { type: Date, default: Date.now },
  notes: String,
  desiredQuantity: { type: Number, default: 1 },
  paymentMethod: { type: String, enum: ['wallet', 'bank', 'card', 'installment'] },
  fundingProgress: { type: Number, default: 0, min: 0, max: 100 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.models.ImportedProduct || mongoose.model('ImportedProduct', importedProductSchema);