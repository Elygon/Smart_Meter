const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    fullname : String, 
    email: String, 
    phone_no: String,
    password: String,
    confirm_password: String,
    role: {type: String, default: "user"},
    gender: String,
    img_id: String,
    img_url: String,
    timestamp: Number,
    is_online:{type: Boolean, default: false },
    is_deleted: {type: Boolean, default: false},
    last_login: Number,
    last_logout: Number, 
    status: {type: String, enum: ["Active", "Suspened", "Deactivated"], default: "Active"},//Status can be 'Active', 'Suspended' or 'Deleted'
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    smartMeter: {type: mongoose.Schema.Types.ObjectId, ref: 'SmartMeters'},
    deletionReason: {type: String, default: null}, //Reason provided by the admin when the account is deleted
}, {collection: 'User'})

const model = mongoose.model('User', userSchema)
module.exports = model