import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';

export const createTransaction = async (req, res) => {
  try {
    const { vehicleId, amount, paymentMethod, status } = req.body;
    
    // Validate required fields
    if (!vehicleId || !amount || !paymentMethod) {
      return res.status(400).json({ 
        message: 'Please provide all required fields',
        code: 'MISSING_FIELDS'
      });
    }

    const userId = req.user._id;

    // Create the transaction
    const transaction = new Transaction({
      userId,
      vehicleId,
      amount,
      paymentMethod,
      status: status || 'pending'
    });

    // Save the transaction
    const savedTransaction = await transaction.save();

    // Add transaction to user's history
    await User.findByIdAndUpdate(userId, {
      $push: { transactionHistory: savedTransaction._id }
    });

    // Update vehicle status if transaction is completed
    if (status === 'completed') {
      await Vehicle.findByIdAndUpdate(vehicleId, {
        $set: { status: 'sold' }
      });
    }

    // Return the populated transaction
    const populatedTransaction = await Transaction.findById(savedTransaction._id)
      .populate('vehicleId', 'make model year price imageUrl')
      .populate('userId', 'firstName lastName email');

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction: populatedTransaction
    });
  } catch (error) {
    console.error('Failed to create transaction:', error);
    res.status(500).json({ 
      message: 'Failed to create transaction',
      code: 'TRANSACTION_CREATE_ERROR'
    });
  }
};

export const getUserTransactions = async (req, res) => {
  try {
    const userId = req.user._id;

    const transactions = await Transaction.find({ userId })
      .populate('vehicleId', 'make model year price imageUrl')
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 });
    
    // Return empty array instead of 404 when no transactions found
    res.json({
      message: transactions.length ? 'Transactions found' : 'No transactions found',
      transactions: transactions,
      count: transactions.length
    });
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    res.status(500).json({ 
      message: 'Failed to fetch transactions',
      code: 'TRANSACTION_FETCH_ERROR'
    });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const transaction = await Transaction.findOne({ _id: id, userId })
      .populate('vehicleId', 'make model year price imageUrl')
      .populate('userId', 'firstName lastName email');

    if (!transaction) {
      return res.status(404).json({
        message: 'Transaction not found or unauthorized',
        code: 'TRANSACTION_NOT_FOUND'
      });
    }

    res.json({
      message: 'Transaction found',
      transaction
    });
  } catch (error) {
    console.error('Failed to fetch transaction:', error);
    res.status(500).json({
      message: 'Failed to fetch transaction',
      code: 'TRANSACTION_FETCH_ERROR'
    });
  }
};

export const updateTransactionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    // Validate status
    const validStatuses = ['pending', 'processing', 'completed', 'failed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status provided',
        code: 'INVALID_STATUS'
      });
    }

    const transaction = await Transaction.findOne({ _id: id, userId });

    if (!transaction) {
      return res.status(404).json({
        message: 'Transaction not found or unauthorized',
        code: 'TRANSACTION_NOT_FOUND'
      });
    }

    // Update transaction status
    transaction.status = status;
    transaction.updatedAt = Date.now();
    await transaction.save();

    // If transaction is completed, update vehicle status
    if (status === 'completed') {
      await Vehicle.findByIdAndUpdate(transaction.vehicleId, {
        $set: { status: 'sold' }
      });
    }

    // If transaction is cancelled and was previously completed,
    // revert vehicle status to available
    if (status === 'cancelled' && transaction.status === 'completed') {
      await Vehicle.findByIdAndUpdate(transaction.vehicleId, {
        $set: { status: 'available' }
      });
    }

    const updatedTransaction = await Transaction.findById(id)
      .populate('vehicleId', 'make model year price imageUrl')
      .populate('userId', 'firstName lastName email');

    res.json({
      message: 'Transaction status updated successfully',
      transaction: updatedTransaction
    });
  } catch (error) {
    console.error('Failed to update transaction status:', error);
    res.status(500).json({
      message: 'Failed to update transaction status',
      code: 'TRANSACTION_UPDATE_ERROR'
    });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const transaction = await Transaction.findOne({ _id: id, userId });

    if (!transaction) {
      return res.status(404).json({
        message: 'Transaction not found or unauthorized',
        code: 'TRANSACTION_NOT_FOUND'
      });
    }

    // Only allow deletion of non-completed transactions
    if (transaction.status === 'completed') {
      return res.status(400).json({
        message: 'Cannot delete completed transactions',
        code: 'TRANSACTION_DELETE_ERROR'
      });
    }

    // Remove transaction from user's history
    await User.findByIdAndUpdate(userId, {
      $pull: { transactionHistory: id }
    });

    // Delete the transaction
    await transaction.remove();

    res.json({
      message: 'Transaction deleted successfully',
      transactionId: id
    });
  } catch (error) {
    console.error('Failed to delete transaction:', error);
    res.status(500).json({
      message: 'Failed to delete transaction',
      code: 'TRANSACTION_DELETE_ERROR'
    });
  }
};