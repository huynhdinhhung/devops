const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    packageName: {
        type: String,
        required: [true, 'Package name is required'],
        trim: true
    },
    description: {
        type: String
    },
    duration: {
        type: Number,
        required: [true, 'Duration (in days) is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Package', packageSchema);
