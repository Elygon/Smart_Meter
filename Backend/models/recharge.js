const mongoose = require('mongoose')
const Schema = mongoose.Schema

const rechargeSchema = new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    meter: {type: mongoose.Schema.Types.ObjectId, ref: 'SmartMeter', // The meter being recharged
        required: true},
    token: {type: String}, // Optional for STS meters
    amount: {type: Number, required: true}, //Amount being recharged
    paymentMethod: {type: String, enum: ['cash', 'bank transfer', 'card payment', 'admin manual'],
        default: 'admin manual'}, 
    reference: {type: String, required: true}, //Unique transaction reference for tracking
    rechargeDate: {type: Date, default: Date.now}, //When the recharge occurred
    rechargedBy: {type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: false}, //Admin that performed the recharge
    status: {type: String, enum: ['pending', 'success', 'failed'], default: 'pending'},
    deleted: {type: Boolean, default: false}
}, {collection: 'Recharge', timestamps: true})

const model = mongoose.model('recharge', rechargeSchema)
module.exports = model