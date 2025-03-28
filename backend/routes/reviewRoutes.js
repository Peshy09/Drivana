import express from 'express';
import { 
    createReview, 
    getReviewsByVehicle, 
    getReviewsByUser,
    updateReview,
    deleteReview,
    getUserReviewStats
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/vehicle/:vehicleId', getReviewsByVehicle);
router.get('/user/:userId', getReviewsByUser);

// Protected routes
router.use(protect);

// Create review
router.post('/', createReview);

// Update review (only owner can update)
router.put('/:reviewId', updateReview);

// Delete review (only owner can delete)
router.delete('/:reviewId', deleteReview);

// Get user's review statistics
router.get('/stats/me', getUserReviewStats);

export default router;