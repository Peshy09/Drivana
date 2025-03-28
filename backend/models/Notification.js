import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'success', 'warning', 'error'], default: 'info' },
  isRead: { type: Boolean, default: false },
  link: { type: String }, // Optional link to redirect when clicked
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date } // Optional expiration date
});

// Index for faster queries on userId and isRead
notificationSchema.index({ userId: 1, isRead: 1 });
// Index for cleanup of expired notifications
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Notification', notificationSchema);