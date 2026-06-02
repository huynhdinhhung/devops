const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        required: true
    },
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription'
    },
    amount: {
        type: Number,
        required: true
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    method: {
        type: String,
        enum: ['Bank', 'Cash', 'Momo'],
        default: 'Cash'
    },
    status: {
        type: String,
        enum: ['Success', 'Pending', 'Failed'],
        default: 'Pending'
    },
    transactionId: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
