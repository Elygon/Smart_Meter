const mongoose = require('mongoose')
const Schema = mongoose.Schema

const adminSchema = new Schema({
    fullname : String, 
    email: String, 
    phone_no: String,
    password: String,
    role: {type: String, default: "admin"},
    gender: String,
    img_id: String,
    img_url: String,
    timestamp: Number,
    is_online:{type: Boolean, default: false },
    is_deleted: {type: Boolean, default: false},
    last_login: Number,
    last_logout: Number, 
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
}, {collection: 'Admin'})

const model = mongoose.model('Admin', adminSchema)
module.exports = model