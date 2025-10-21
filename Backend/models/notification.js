const mongoose = require('mongoose');
const Schema = mongoose.Schema

const notificationSchema = new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    isBroadcast: {type: Boolean, default: false}, // false = sent to specific user, true = sent to all users
    title: String,
    message: String,
    type: {type: String, enum: ['info', 'alert', 'warning', 'update'], default: 'info'}, //Type of notification
    isRead: {type: Boolean, default: false}, //Tracks if user has read it
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true}, //Admin who created the notification
    createdAt: {type: Date, default: Date.now},
}, {collection: 'notifications'});

const model = mongoose.model('Notification', notificationSchema)
module.exports = model