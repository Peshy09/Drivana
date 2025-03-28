import Stripe from 'stripe';
import dotenv from 'dotenv';
import Payment from '../models/Payment.js';
import Vehicle from '../models/Vehicle.js';
import Transaction from '../models/Transaction.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPayment = async (req, res) => {
  try {
    const { amount, paymentMethod, vehicleId, cardDetails } = req.body;

    // Validate vehicle exists
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    let paymentIntent;

    switch (paymentMethod) {
      case 'Credit Card':
        paymentIntent = await stripe.paymentIntents.create({
          amount: amount * 100, // Convert to cents
          currency: 'usd',
          payment_method_types: ['card'],
          metadata: {
            vehicleId,
            userId: req.user._id
          }
        });
        break;

      case 'Mpesa':
        // Implement Mpesa payment logic
        break;

      case 'PayPal':
        // Implement PayPal payment logic
        break;

      default:
        return res.status(400).json({ message: 'Invalid payment method' });
    }

    // Create payment record
    const payment = new Payment({
      userId: req.user._id,
      vehicleId,
      amount,
      paymentMethod,
      paymentIntentId: paymentIntent?.id,
      status: 'Pending'
    });

    await payment.save();

    res.json({
      success: true,
      transactionId: payment._id,
      clientSecret: paymentIntent?.client_secret
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({ message: 'Payment processing failed' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check payment status based on payment method
    let verified = false;

    switch (payment.paymentMethod) {
      case 'Credit Card':
        const paymentIntent = await stripe.paymentIntents.retrieve(payment.paymentIntentId);
        verified = paymentIntent.status === 'succeeded';
        break;

      // Add other payment method verifications
    }

    if (verified) {
      payment.status = 'Completed';
      await payment.save();
    }

    res.json({ success: verified });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Verification failed' });
  }
};

// Create a payment intent
export const createPaymentIntent = async (req, res) => {
  try {
    const { vehicleId } = req.body;
    const userId = req.user._id;

    // Get vehicle details
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: vehicle.price * 100, // Stripe expects amount in cents
      currency: 'usd',
      metadata: {
        vehicleId: vehicleId.toString(),
        userId: userId.toString(),
        vehicleName: `${vehicle.make} ${vehicle.model} ${vehicle.year}`
      }
    });

    // Create a pending transaction
    const transaction = new Transaction({
      userId,
      vehicleId,
      amount: vehicle.price,
      paymentMethod: 'card',
      status: 'Pending',
      stripePaymentIntentId: paymentIntent.id
    });
    await transaction.save();

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      transactionId: transaction._id
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ message: 'Error creating payment intent' });
  }
};

// Handle successful payment
export const handlePaymentSuccess = async (req, res) => {
  try {
    const { paymentIntentId, transactionId } = req.body;

    // Verify payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not successful' });
    }

    // Update transaction status
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    transaction.status = 'Completed';
    transaction.completedAt = new Date();
    await transaction.save();

    // Update vehicle status (e.g., mark as sold)
    const vehicle = await Vehicle.findById(transaction.vehicleId);
    if (vehicle) {
      vehicle.status = 'Sold';
      vehicle.soldTo = transaction.userId;
      vehicle.soldAt = new Date();
      await vehicle.save();
    }

    res.status(200).json({
      message: 'Payment processed successfully',
      transaction: transaction
    });
  } catch (error) {
    console.error('Payment success handling error:', error);
    res.status(500).json({ message: 'Error processing payment confirmation' });
  }
};

// Handle webhook events from Stripe
export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await handleSuccessfulPayment(paymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        await handleFailedPayment(failedPayment);
        break;

      // Add other event types as needed
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ message: `Webhook Error: ${error.message}` });
  }
};

// Helper function to handle successful payments
const handleSuccessfulPayment = async (paymentIntent) => {
  try {
    const transaction = await Transaction.findOne({
      stripePaymentIntentId: paymentIntent.id
    });

    if (transaction) {
      transaction.status = 'Completed';
      transaction.completedAt = new Date();
      await transaction.save();

      // Update vehicle status
      const vehicle = await Vehicle.findById(transaction.vehicleId);
      if (vehicle) {
        vehicle.status = 'Sold';
        vehicle.soldTo = transaction.userId;
        vehicle.soldAt = new Date();
        await vehicle.save();
      }
    }
  } catch (error) {
    console.error('Error handling successful payment:', error);
    throw error;
  }
};

// Helper function to handle failed payments
const handleFailedPayment = async (paymentIntent) => {
  try {
    const transaction = await Transaction.findOne({
      stripePaymentIntentId: paymentIntent.id
    });

    if (transaction) {
      transaction.status = 'Failed';
      transaction.error = paymentIntent.last_payment_error?.message;
      await transaction.save();
    }
  } catch (error) {
    console.error('Error handling failed payment:', error);
    throw error;
  }
};

// Get payment status
export const getPaymentStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const transaction = await Transaction.findById(transactionId)
      .populate('vehicleId', 'make model year price');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json({
      status: transaction.status,
      transaction: transaction
    });
  } catch (error) {
    console.error('Error fetching payment status:', error);
    res.status(500).json({ message: 'Error fetching payment status' });
  }
};