const express = require('express')
const router = express.Router()

const dotenv = require('dotenv')
dotenv.config()

const jwt = require('jsonwebtoken')
const Reply = require('../models/reply')
const Contact = require('../models/contact')


// Admin reply to a user inquiry (ticket)
router.post('/reply', async(req, res) => {
    const {token, contactId, message} = req.body

    if(!token || !contactId || !message) {
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'})
    }

    try {
        //Verify the user's token
        const admin = jwt.verify(token, process.env.JWT_SECRET)

        const inquiry = await Contact.findById(contactId)
        if (!inquiry) {
            return res.status(400).send({status: "error", msg: "Contact ticket not found"})
        }

        // Create a reply
        const reply = await Reply.create()
        reply.contact = inquiry._id
        reply.message = message
        reply.repliedBy = req.admin._id

        // Update contact status to "In Progress" when replying
        contact.status = 'In Progress'
        await inquiry.save()
        await reply.save()

        return res.status(200).send({status: 'success', msg: 'Reply sent successfully', reply})

    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg:'Error sending reply', error: e.message})
    }  
})


// Admin updates the status of a contact ticket
router.post('/update', async(req, res) => {
    const {token, contactId, status} = req.body

    if(!token || !contactId || !status) {
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'})
    }

    try {
        //Verify the user's token
        const admin = jwt.verify(token, process.env.JWT_SECRET)

        const vStatus = ['open', 'in-progress', 'resolved', 'closed']

        if(!vStatus.includes(status.toLowerCase())) {
            return res.status(400).send({status: 'error', msg: 'Invalid status. Use pending, in-progress or resolved'})
        }

        const contact = await Contact.findByIdAndUpdate(
            contactId,
            { status: status.toLowerCase()},
            { new: true }
        )
        if (!contact) {
            return res.status(400).send({status: "error", msg: "Contact ticket not found"})
        }

        return res.status(200).send({status: 'success', msg: 'Contact status updated', contact})

    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg:'Error updating status', error: e.message})
    }  
})


// View all replies to a inquiry ticket
router.post('/replies', async(req, res) => {
    const {token, contactId} = req.body

    if(!token || !contactId) {
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'})
    }

    try {
        //Verify the user's token
        const admin = jwt.verify(token, process.env.JWT_SECRET)

        const replies = await Reply.find({ contact: contactId }).populate('repliedBy', 'fullname email')

        return res.status(200).send({status: 'success', replies})

    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg:'Error fetching replies', error: e.message})
    }  
})

// View all inquiry tickets
router.post('/all', async(req, res) => {
    const {token} = req.body

    if(!token) {
        return res.status(400).send({status: 'error', msg: 'Token must be provided.'})
    }

    try {
        //Verify the user's token
        const admin = jwt.verify(token, process.env.JWT_SECRET)

        const inquiries = await Contact.find().populate('user', 'fullname email').sort({ createdAt: -1})

        return res.status(200).send({status: 'success', inquiries})

    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg:'Error fetching inquiry tickets.', error: e.message})
    }  
})

// View one specific inquiry ticket
router.post('/specific', async(req, res) => {
    const {token, contactId} = req.body

    if(!token || !contactId) {
        return res.status(400).send({status: 'error', msg: 'All fields must be filled.'})
    }

    try {
        //Verify the user's token
        const admin = jwt.verify(token, process.env.JWT_SECRET)

        const inquiry = await Contact.findById(contactId).populate('user', 'fullname email')
        if (!inquiry) {
            return res.status(400).send({ status: 'error', msg: 'Inquiry ticket not found.'})
        }
        return res.status(200).send({status: 'success', inquiry})

    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg:'Error fetching inquiry ticket.', error: e.message})
    }  
})

module.exports = router