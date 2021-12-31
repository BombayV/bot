const { Schema, models, model } = require('mongoose');

const schema = new Schema({
    userId: {
        type: String,
        required: true
    },
    adminId: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    expires: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
})

module.exports = models['ban'] || model('ban', schema);