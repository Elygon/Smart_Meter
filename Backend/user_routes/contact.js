const express = require('express')
const router = express.Router()

const dotenv = require('dotenv')
dotenv.config()

const jwt = require('jsonwebtoken')
const Contact = require('../models/contact')


// User sends a inquiry ticket
router.post('/send', async(req, res) => {
    const {token, reason, message} = req.body

    if(!token || !reason || !message) {
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'})
    }

    try {
        //Verify the user's token
        const user = jwt.verify(token, process.env.JWT_SECRET)

        const inquiry = new Contact()
        inquiry.user = user._id
        inquiry.reason = reason
        inquiry.message = message

        await inquiry.save()

        return res.status(200).send({status: 'success', msg: 'Message sent successfully', inquiry})

    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg:'Error sending message', error: e.message})
    }  
})

// View all inquiry tickets for the logged-in user
router.post('/all', async(req, res) => {
    const {token} = req.body

    if(!token) {
        return res.status(400).send({status: 'error', msg: 'Token must be provided.'})
    }

    try {
        //Verify the user's token
        const user = jwt.verify(token, process.env.JWT_SECRET)

        // Find all inquiries for this user
        const inquiries = await Contact.find({user: user._id}).sort({ createdAt: -1})

        if (!inquiries.length) {
            return res.status(400).send({ status: 'error', msg: 'No inquiries found.'})
        }

        return res.status(200).send({status: 'success', msg: 'Inquiries retrieved successfully', inquiries})

    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg:'Error retrieving inquiry tickets.', error: e.message})
    }  
})


// View a specific inquiry ticket
router.post('/view', async(req, res) => {
    const {token, contactId} = req.body

    if(!token || !contactId) {
        return res.status(400).send({status: 'error', msg: 'All fields must be filled.'})
    }

    try {
        //Verify the user's token
        const user = jwt.verify(token, process.env.JWT_SECRET)

        // Find the inquiry
        const inquiry = await Contact.findOne({_id: contactId, user: user._id})

        if (!inquiry) {
            return res.status(400).send({ status: 'error', msg: 'Inquiry not found.'})
        }

        return res.status(200).send({status: 'success', msg: 'Inquiry retrieved successfully', inquiry})

    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg:'Error retrieving inquiry ticket.', error: e.message})
    }  
})

module.exports = router