const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String, // e.g. Cardio, Strength, Accessory
        required: true
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    nextMaintenance: {
        type: Date
    },
    status: {
        type: String,
        enum: ['Functional', 'Under Repair', 'Broken'],
        default: 'Functional'
    },
    description: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Equipment', equipmentSchema);
