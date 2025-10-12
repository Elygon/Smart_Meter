const mongoose = require('mongoose');
const Schema = mongoose.Schema

const replySchema = new Schema({
    contact: { //Link to the user's complaint
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact', required: true
    },
    repliedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'Admin', //Links to the admin who replied 
        required: true},
    message: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
}, {collection: 'reply'});

const model = mongoose.model('Reply', replySchema)
module.exports = model