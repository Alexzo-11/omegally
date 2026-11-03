import mongoose from 'mongoose';

const adSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String, required: true },
  linkUrl: { type: String, default: '/' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Ad || mongoose.model('Ad', adSchema);
