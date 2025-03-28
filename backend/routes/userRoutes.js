import express from 'express';
import {
  registerUser,
  loginUser,
  logout,
  validateSession,
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  getSavedVehicles,
  getTransactionHistory,
  getAllUsers
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { upload } from '../controllers/userController.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.use(protect); // All routes below this will require authentication

// Session management
router.post('/logout', logout);
router.get('/validate-session', validateSession);

// Profile management
router.route('/profile')
  .get(getUserProfile)
  .put(updateUserProfile);

// Profile picture upload
router.post('/profile/picture', upload.single('profilePicture'), uploadProfilePicture);

// Saved vehicles
router.get('/saved-vehicles', getSavedVehicles);

// Transaction history with pagination
router.get('/transactions', getTransactionHistory);

// Admin routes
router.get('/all', admin, getAllUsers);

export default router;