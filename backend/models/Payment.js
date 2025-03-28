import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true, enum: ['Credit Card', 'Mpesa', 'PayPal'] },
  status: { type: String, required: true, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  paymentIntentId: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Payment', paymentSchema);