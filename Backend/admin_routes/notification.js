const express = require('express')
const router = express.Router()

const dotenv = require('dotenv')
dotenv.config()

const jwt = require('jsonwebtoken')
const Notification = require('../models/notification')
const User = require('../models/user')
const Admin = require('../models/admin')


//send notification
router.post('/send', async(req, res) =>{
    const {token, user_id, title, message, type} = req.body

    if(!token || !title || !message) {
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'})
    }

    try {
        //Verify the admin's token
        const admin = jwt.verify(token, process.env.JWT_SECRET)

        // allowed notification types
        const allowedTypes = ["info", "alert", "warning", "update"]
        const notificationType = allowedTypes.includes(type) ? type: "info"

        if (user_id && user_id != "all") {
            // send to one specific user
            const notification = new Notification()
            notification.user = user_id //Can be "all" for everyone or a specific user ID
            notification.title = title
            notification.message = message
            notification.type = notificationType
            notification.createdBy = admin._id
        
            await notification.save()
            return res.status(200).send({status: "ok", msg: "Notification sent to user", notification})
        } else {
            // Send to all users
            const users = await User.find().select("_id")
            const notifications = users.map((u) => ({
                user: u._id, // a specific user ID
                title,
                message,
                type: notificationType,
                createdBy: admin._id
            }))
            
            await Notification.insertMany(notifications)
            return res.status(200).send({status: "ok", msg: "Notification sent to all users.", notifications})
        }
    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg:'Error sending notification', error: e.message})
    }  
})


//endpoint to update a notification
router.post('/update', async(req, res) =>{
    const {token, id, title, message, type} = req.body

    if(!token || !id || !title || !message || !type) {
        return res.status(400).send({status: 'error', msg: 'All fields are required'})
    }

    try {
        //Verify the admin's token
        const admin = jwt.verify(token, process.env.JWT_SECRET)

        //Find the existing notification
        const updated = await Notification.findOneAndUpdate({_id: id, createdBy: admin._id},
            {title, message, type, updatedAt: Date.now() }, {new: true})

            if (!updated) {
                return res.status(400).send({status: "error", msg: "Notification not found"})
            }
        
        return res.status(200).send({status: "ok", msg: "Notification updated", updated})
    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg:'Error updating notification', error: e.message})
    }  
})


//View all notifications
router.post('/view', async(req, res) => {
    const {token} = req.body

    if(!token) {
        return res.status(400).send({status: 'error', msg: 'Token must be provided'})
    }

    try {
        //Verify the admin's token
        const admin = jwt.verify(token, process.env.JWT_SECRET)

        //Fetch all notifications sent by this admin
        const notifications = await Notification.find().sort({ createdAt: -1 }) // latest first
        .populate('createdBy', 'fullname email'); // include admin's fullname & email

        return res.status(200).send({status: 'ok', msg: 'Notifications retrieved successfully', notifications})
    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg:'Failed to retrieve notifications', error: e.message})
    }  
})

//Delete a notification
router.post('/delete', async(req, res) => {
    const {token, notificationIds} = req.body

    if(!token) {
        return res.status(400).send({status: 'error', msg: 'Token must be provided.'})
    }

    try {
        //Verify the admin's token
        const Admin = jwt.verify(token, process.env.JWT_SECRET)

        if (!notificationIds || notificationIds.length === 0) {
            return res.status(400).send({status: "error", msg: "No notification ID(s) provided"})
        }

        // Ensure notificationIds is always an array
        const ids = Array.isArray(notificationIds) ? notificationIds : [notificationIds]

        await Notification.deleteMany({_id: {$in: ids} })

        return res.status(200).send({status: 'ok', msg: `${ids.length} notification(s) deleted successfully`})
    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg:'An error occurred', error: e.message})
    }  
})

// View a single notification
router.post('/single', async(req, res) => {
    const {token, id} = req.body

    if(!token || !id) {
        return res.status(400).send({status: 'error', msg: 'Token must be provided'})
    }

    try {
        //Verify the admin's token
        const Admin = jwt.verify(token, process.env.JWT_SECRET)

        const notification = await Notification.findById(id).populate("createdBy", "fullname email")
        
        if (!notification) {
            return res.status(400).send({status: "error", msg: "Notification not found"})
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