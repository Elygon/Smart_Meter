const mongoose = require('mongoose')
const Schema = mongoose.Schema

const logSchema = new Schema({
    meter: {type: mongoose.Schema.Types.ObjectId, ref: 'SmartMeter', //Links to smart meters model
        required: true},
    energyUsage: {type: Number, required: true, unique: true}, //Energy usage recorded in the log kWh
    event: {type: String, required: true}, // Optional event e.g., 'Power Surge', 'Energy Consumption'
    balance: {type: Number, required: true},
    status: {type: String, enum: ['active', 'inactive', 'disconnected', 'error'], default: 'inactive'},
    description: {type: String},
    timestamp: {type: Date, default: Date.now}, //Auto timestamp when the log is created
    recordedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'Admin',
        required: false //make optional to support auto logs
    }
}, {collection: 'Log'})

const model = mongoose.model('log', logSchema)
module.exports = model