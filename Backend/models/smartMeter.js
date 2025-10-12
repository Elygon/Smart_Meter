const mongoose = require('mongoose')
const Schema = mongoose.Schema

const smartMeterSchema = new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', //Links to members model
        required: true},
    meterId: {type: String}, //Unique identifier for internal use
    meterNumber: {type: String, required: false},//Unique identifier for the physical meter
    meterType: {type: String, enum: ['prepaid', 'postpaid'], required: true},
    meterTech: {type: String, enum: ['sts', 'iot'], required: true},
    address: {type: String, required: true},
    status: {type: String, enum: ['pending', 'approved', 'installed','active', 'inactive', 'faulty','disconnected', 'rejected']
        , default: 'pending'},
    installationDate: {type: Date, default: Date.now},
    lastUpdated: {type: Date, default: Date.now},
    balance: {type: Number, default: 0},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
}, {collection: 'SmartMeters'})

const model = mongoose.model('smartMeters', smartMeterSchema)
module.exports = model