import Review from '../models/Review.js';

export const createReview = async (req, res) => {
  try {
    const { vehicleId, dealershipId, rating, comment, customerPhoto } = req.body;
    const review = new Review({ 
      userId: req.user._id,
      vehicleId, 
      dealershipId, 
      rating, 
      comment,
      customerPhoto 
    });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    console.error('Failed to create review:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getReviewsByVehicle = async (req, res) => {
  try {
    const reviews = await Review.find({ vehicleId: req.params.vehicleId })
      .populate('userId', 'username profilePhoto')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getReviewsByUser = async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.params.userId })
      .populate('vehicleId', 'make model year')
      .populate('dealershipId', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Failed to fetch user reviews:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findOne({ 
      _id: req.params.reviewId,
      userId: req.user._id
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found or unauthorized' });
    }

    review.rating = rating;
    review.comment = comment;
    review.updatedAt = Date.now();
    await review.save();

    res.json(review);
  } catch (error) {
    console.error('Failed to update review:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.reviewId,
      userId: req.user._id
    });
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found or unauthorized' });
    }
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Failed to delete review:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getUserReviewStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get total number of reviews
    const totalReviews = await Review.countDocuments({ userId });
    
    // Get average rating given
    const averageRating = await Review.aggregate([
      { $match: { userId } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);
    
    // Get reviews count by rating
    const ratingDistribution = await Review.aggregate([
      { $match: { userId } },
      { $group: { _id: "$rating", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalReviews,
      averageRating: averageRating[0]?.avgRating || 0,
      ratingDistribution: ratingDistribution.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('Failed to fetch user review stats:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};