import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    getRecommendedVehicles,
    getPersonalizedRecommendations,
    updateUserPreferences
} from '../controllers/recommendationController.js';

const router = express.Router();

// Protected routes
router.use(protect);

// Get recommended vehicles based on user preferences
router.get('/vehicles', getRecommendedVehicles);

// Get personalized recommendations
router.get('/personalized', getPersonalizedRecommendations);

// Update user preferences for recommendations
router.put('/preferences', updateUserPreferences);

export default router;