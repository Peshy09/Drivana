import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  preferences: {
    priceRange: {
      min: Number,
      max: Number
    },
    brands: [String],
    yearRange: {
      min: Number,
      max: Number
    },
    bodyTypes: [String],
    fuelTypes: [String],
    transmission: String,
    features: [String],
    color: String,
    mileageRange: {
      min: Number,
      max: Number
    },
    engineCapacityRange: {
      min: Number,
      max: Number
    }
  },
  recentlyViewed: [{
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  searchHistory: [{
    query: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Index for faster lookups
recommendationSchema.index({ userId: 1 });
recommendationSchema.index({ 'recentlyViewed.viewedAt': -1 });
recommendationSchema.index({ 'searchHistory.timestamp': -1 });

export default mongoose.model('Recommendation', recommendationSchema);