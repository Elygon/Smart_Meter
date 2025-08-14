const express = require('express')
const router = express.Router()

const dotenv = require('dotenv')
dotenv.config()

const jwt = require('jsonwebtoken')
const Notification = require('../models/notifications')
const Admin = require('../models/admin')

//send a notification to a user
router.post('/send', async(req, res) =>{
    const {token, user_id, title, message, type} = req.body

    if(!token || !user_id || !title || !message) {
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'})
    }

    try {
        //Verify the admin's token
        const admin = jwt.verify(token, process.env.JWT_SECRET)

        //Create a new notification
        const notification = new Notification()
        
        notification.title = title
        notification.message = message
        notification.user = user_id //Can be "all" for everyone or a specific user ID
        notification.createdBy = admin._id
        notification.type = type
        
        await notification.save()

        return res.status(200).send({status: "ok", msg: "Notification sent successfully", notification})
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


//View all notification
router.post('/view', async(req, res) => {
    const {token} = req.body

    if(!token) {
        return res.status(400).send({status: 'error', msg: 'Token must be provided'})
    }

    try {
        //Verify the admin's token
        const admin = jwt.verify(token, process.env.JWT_SECRET)

        //Fetch all notifications sent by this admin
        const notification = await Notification.find({ createdBy: admin._id}).sort({createdAt: -1})

        return res.status(200).send({status: 'ok', msg: 'Notifications retrieved successfully', notification})
    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg:'Failed to retrieve notifications', error: e.message})
    }  
})

//Delete a notification
router.post('/delete', async(req, res) => {
    const {token, notificationId} = req.body

    if(!token || !notificationId) {
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'})
    }

    try {
        //Verify the admin's token
        const Admin = jwt.verify(token, process.env.JWT_SECRET)

        //Delete the notification
        const deleted = await Notification.findByIdAndDelete({_id: id, createdBy: admin._id})

        if (!deleted) {
            return res.status(400).send({status: 'error', msg: 'Notification not found'})
        }

        return res.status(200).send({status: 'ok', msg: 'Notification deleted'})
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

        const notification = await Notification.findById(id).populate("user", "fullname email")
        
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