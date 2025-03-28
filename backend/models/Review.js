import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  dealershipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dealership' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  customerPhoto: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Review', reviewSchema);