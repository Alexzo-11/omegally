import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['order', 'payment', 'installment', 'promotion', 'system'] },
  title: String,
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  data: mongoose.Schema.Types.Mixed, // for extra info like orderId
  scheduledFor: Date,
}, { timestamps: true });

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema);