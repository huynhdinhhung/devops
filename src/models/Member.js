const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    birthDate: {
        type: Date
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    phone: {
        type: String,
        trim: true
    },
    address: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Member', memberSchema);
