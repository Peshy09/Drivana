import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  processPayment,
  getPaymentStatus,
  getPaymentHistory,
  refundPayment,
  savePaymentMethod
} from '../controllers/paymentController.js';

const router = express.Router();

// Protected routes
router.use(protect);

// Process a new payment
router.post('/process', processPayment);

// Get payment status
router.get('/status/:paymentId', getPaymentStatus);

// Get user's payment history
router.get('/history', getPaymentHistory);

// Process refund
router.post('/refund/:paymentId', refundPayment);

// Save payment method
router.post('/methods', savePaymentMethod);

export default router;