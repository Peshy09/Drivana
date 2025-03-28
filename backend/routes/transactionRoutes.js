import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    createTransaction,
    getTransactionById,
    getUserTransactions,
    updateTransactionStatus,
    deleteTransaction
} from '../controllers/transactionController.js';

const router = express.Router();

// Protected routes
router.use(protect);

// Get user's transactions
router.get('/', getUserTransactions);

// Get specific transaction
router.get('/:id', getTransactionById);

// Create new transaction
router.post('/', createTransaction);

// Update transaction status
router.put('/:id/status', updateTransactionStatus);

// Delete transaction
router.delete('/:id', deleteTransaction);

export default router;