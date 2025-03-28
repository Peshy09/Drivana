import Recommendation from '../models/Recommendation.js';
import Vehicle from '../models/Vehicle.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

export const getRecommendedVehicles = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get user preferences
    let userPreferences = await Recommendation.findOne({ userId });
    
    // Build query based on preferences
    const query = {};
    if (userPreferences?.preferences) {
      if (userPreferences.preferences.priceRange?.min != null && 
          userPreferences.preferences.priceRange?.max != null) {
        query.price = {
          $gte: userPreferences.preferences.priceRange.min,
          $lte: userPreferences.preferences.priceRange.max
        };
      }
      if (userPreferences.preferences.brands?.length > 0) {
        query.make = { $in: userPreferences.preferences.brands };
      }
      if (userPreferences.preferences.yearRange?.min != null && 
          userPreferences.preferences.yearRange?.max != null) {
        query.year = {
          $gte: userPreferences.preferences.yearRange.min,
          $lte: userPreferences.preferences.yearRange.max
        };
      }
      // Add body type preferences
      if (userPreferences.preferences.bodyTypes?.length > 0) {
        query.bodyType = { $in: userPreferences.preferences.bodyTypes };
      }
      // Add fuel type preferences
      if (userPreferences.preferences.fuelTypes?.length > 0) {
        query.fuelType = { $in: userPreferences.preferences.fuelTypes };
      }
    }

    // Get recommended vehicles
    const recommendations = await Vehicle.find(query)
      .limit(10)
      .sort({ createdAt: -1 });

    // If no recommendations found with filters, return trending vehicles
    if (recommendations.length === 0) {
      const trendingVehicles = await Vehicle.find()
        .sort({ viewCount: -1 })
        .limit(10);
      return res.json(trendingVehicles);
    }

    res.json(recommendations);
  } catch (error) {
    console.error('Error getting recommended vehicles:', error);
    res.status(500).json({ 
      message: 'Failed to get recommended vehicles',
      error: error.message 
    });
  }
};

export const getPersonalizedRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's transaction history
    const userTransactions = await Transaction.find({ userId })
      .populate('vehicleId')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get user's browsing history from preferences
    const userPreferences = await Recommendation.findOne({ userId });
    
    // Initialize recommendation scores for different aspects
    let preferredMakes = new Set();
    let preferredPriceRange = { min: 0, max: Infinity };
    let preferredBodyTypes = new Set();

    // Analyze transaction history
    userTransactions.forEach(transaction => {
      if (transaction.vehicleId) {
        preferredMakes.add(transaction.vehicleId.make);
        preferredBodyTypes.add(transaction.vehicleId.bodyType);
        // Adjust price range based on historical transactions
        preferredPriceRange.min = Math.min(preferredPriceRange.min, transaction.vehicleId.price * 0.8);
        preferredPriceRange.max = Math.max(preferredPriceRange.max, transaction.vehicleId.price * 1.2);
      }
    });

    // Combine with user preferences if available
    if (userPreferences?.preferences) {
      if (userPreferences.preferences.brands) {
        userPreferences.preferences.brands.forEach(brand => preferredMakes.add(brand));
      }
      if (userPreferences.preferences.bodyTypes) {
        userPreferences.preferences.bodyTypes.forEach(type => preferredBodyTypes.add(type));
      }
      // Adjust price range based on preferences
      if (userPreferences.preferences.priceRange) {
        preferredPriceRange = {
          min: Math.min(preferredPriceRange.min, userPreferences.preferences.priceRange.min),
          max: Math.max(preferredPriceRange.max, userPreferences.preferences.priceRange.max)
        };
      }
    }

    // Build recommendation query
    const recommendationQuery = {
      $or: [
        { make: { $in: Array.from(preferredMakes) } },
        { bodyType: { $in: Array.from(preferredBodyTypes) } }
      ],
      price: {
        $gte: preferredPriceRange.min,
        $lte: preferredPriceRange.max
      },
      status: 'available' // Only show available vehicles
    };

    // Get personalized recommendations
    const personalizedRecommendations = await Vehicle.find(recommendationQuery)
      .sort({ createdAt: -1 })
      .limit(15);

    // If not enough recommendations, supplement with trending vehicles
    if (personalizedRecommendations.length < 5) {
      const trendingVehicles = await Vehicle.find({ status: 'available' })
        .sort({ viewCount: -1 })
        .limit(10);
      return res.json([...personalizedRecommendations, ...trendingVehicles]);
    }

    res.json(personalizedRecommendations);
  } catch (error) {
    console.error('Error getting personalized recommendations:', error);
    res.status(500).json({ 
      message: 'Failed to get personalized recommendations',
      error: error.message 
    });
  }
};

export const updateUserPreferences = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      brands,
      priceRange,
      yearRange,
      bodyTypes,
      fuelTypes,
      transmission,
      features,
      color
    } = req.body;

    const updatedPreferences = await Recommendation.findOneAndUpdate(
      { userId },
      { 
        userId,
        preferences: {
          brands,
          priceRange,
          yearRange,
          bodyTypes,
          fuelTypes,
          transmission,
          features,
          color
        },
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );

    // Update user's last activity
    await User.findByIdAndUpdate(userId, {
      $set: { lastActivity: new Date() }
    });

    res.json(updatedPreferences);
  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({ message: 'Failed to update user preferences' });
  }
};