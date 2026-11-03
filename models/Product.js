import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  discountPrice: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  currency: { type: String, default: 'NGN' },
  images: { type: [String], default: [] },
  videoUrl: { type: String, default: '' },
  category: { type: String, default: 'Other' },
  brand: String,
  sizes: { type: [String], default: [] },
  colors: { type: [String], default: [] },
  stock: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  numReviews: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', productSchema);