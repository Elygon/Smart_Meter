const express = require('express')
const router = express.Router()

const dotenv = require('dotenv')
dotenv.config()

const jwt = require('jsonwebtoken')
const Notification = require('../models/notification')



//View all notifications for a user
router.post('/all', async(req, res) => {
    const {token} = req.body

    if(!token) {
        return res.status(400).send({status: 'error', msg: 'Token must be provided'})
    }

    try {
        //Verify the user's token
        const user = jwt.verify(token, process.env.JWT_SECRET)

        //Fetch all notifications sent to the user or to all users
        const notifications = await Notification.find({ $or: [{user: user._id}, {user: "all"}], }).sort({createdAt: -1 })

        if (!notifications || notifications.length === 0) {
            return res.status(400).send({status: "error", msg: "No notifications found"})
        }

        return res.status(200).send({status: 'ok', notifications})
    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg:'Failed to retrieve notifications', error: e.message})
    }  
})

// View a single notification
router.post('/single', async(req, res) => {
    const {token, id} = req.body

    if(!token || !id) {
        return res.status(400).send({status: 'error', msg: 'Token must be provided'})
    }

    try {
        //Verify the user's token
        const user = jwt.verify(token, process.env.JWT_SECRET)

        //Find the notification by its ID and ensure it belongs to the user
        const notification = await Notification.findOne({_id: id, user: user._id})
        
        if (!notification) {
            return res.status(400).send({status: "error", msg: "Notification not found or not yours"})
        }
        return res.status(200).send({status: 'ok', notification})
    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg:'Failed to retrieve the notification', error: e.message})
    }  
})
module.exports = router