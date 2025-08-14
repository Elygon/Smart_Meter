const mongoose = require('mongoose');
const Schema = mongoose.Schema

const contactSchema = new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    name: {type: String, requred: true},
    email: {type: String, required: true},
    reason: {
        type: String,
        enum: [
            "Billing Issue",
            "Meter Malfunction",
            "Recharge Not Working",
            "Usage Discrepancy",
            "General Inquiry",
            "Other"
        ],
        required: true
    },
    message: {type: String, required: true},
    status: {
        type: String,
        enum: ["open", "in-progress", "resolved", "closed"],
        default: "open"
    },
    createdAt: {type: Date, default: Date.now},
}, {collection: 'contact'});

const model = mongoose.model('Contact', contactSchema)
module.exports = model