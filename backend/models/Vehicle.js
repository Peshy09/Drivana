import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  mileage: { type: Number, required: true },
  fuelType: { type: String, required: true, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'] },
  transmission: { type: String, required: true, enum: ['Automatic', 'Manual'] },
  engineCapacity: { type: Number, required: true },
  images: { type: [String], required: true },
  description: { type: String, required: true },
  specifications: {
    engine: { type: String, required: true },
    power: { type: String, required: true },
    torque: { type: String, required: true },
    acceleration: { type: String, required: true },
    topSpeed: { type: String, required: true },
    fuelTank: { type: String, required: true },
    groundClearance: { type: String, required: true },
    seatingCapacity: { type: String, required: true },
    bootSpace: { type: String, required: true },
    dimensions: { type: String, required: true },
  },
  features: { type: [String], required: true },
  safetyFeatures: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;