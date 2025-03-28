import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['purchase', 'rental', 'service'],
        required: true,
        default: 'purchase'
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['credit_card', 'debit_card', 'bank_transfer', 'crypto']
    },
    paymentDetails: {
        stripePaymentIntentId: String,
        last4: String,
        cardBrand: String,
        receiptUrl: String
    },
    metadata: {
        ipAddress: String,
        userAgent: String,
        location: String
    },
    notes: String,
    completedAt: Date,
    cancelledAt: Date,
    refundedAt: Date
}, {
    timestamps: true
});

// Indexes for faster queries
transactionSchema.index({ userId: 1, status: 1 });
transactionSchema.index({ vehicleId: 1 });
transactionSchema.index({ createdAt: -1 });

// Generate unique transaction ID before saving
transactionSchema.pre('save', function(next) {
    if (!this.transactionId) {
        const timestamp = Date.now().toString(36);
        const randomStr = Math.random().toString(36).substr(2, 5).toUpperCase();
        this.transactionId = `TRX-${timestamp}-${randomStr}`;
    }
    next();
});

// Virtual for transaction age
transactionSchema.virtual('age').get(function() {
    return Math.floor((Date.now() - this.createdAt) / 1000 / 60 / 60 / 24);
});

// Ensure virtuals are included in JSON output
transactionSchema.set('toJSON', { virtuals: true });
transactionSchema.set('toObject', { virtuals: true });

export default mongoose.model('Transaction', transactionSchema);