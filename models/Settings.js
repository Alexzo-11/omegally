import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'EcomFlex' },
  logo: String,
  currency: { type: String, default: 'USD' },
  taxRate: { type: Number, default: 0 },
  shippingCost: { type: Number, default: 0 },
  freeShippingThreshold: { type: Number, default: 100 },
  maxInstallments: { type: Number, default: 12 },
  installmentInterestRate: { type: Number, default: 0 },
  enableWallet: { type: Boolean, default: true },
  enableReviews: { type: Boolean, default: true },
  enableWishlist: { type: Boolean, default: true },
  socialLinks: {
    twitter: String,
    facebook: String,
    instagram: String,
    youtube: String,
  },
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model('Settings', settingsSchema);