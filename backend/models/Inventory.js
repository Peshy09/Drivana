import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  quantity: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Inventory', inventorySchema);