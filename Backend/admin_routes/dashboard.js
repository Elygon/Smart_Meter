const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken')
const User = require('../models/user')
const SmartMeter = require('../models/smartMeter')
const Contact = require('../models/contact')


// Admin dashboard summary
router.post('/stats', async (req, res) => {
    const { token } = req.body

    if (!token) {
        return res.status(400).send({ status: 'error', msg: 'Token required' })
    }

    try {
        const admin = jwt.verify(token, process.env.JWT_SECRET)

       // Check if token belongs to an admin
       if (admin.role !== 'admin') {
            return res.status(403).send({ status: 'error', msg: 'Access denied' })
        }

        // Count total users
        const totalUsers = await User.countDocuments({ role: 'user' })

        // Count active meters (status = active)
        const activeMeters = await SmartMeter.countDocuments({
            status: { $in: ['active', 'installed', 'approved'] },
        })

        // Count pending/open tickets (status = open or in-progress)
        const pendingTickets = await Contact.countDocuments({
            status: { $in: ['open', 'in-progress'] },
        })

        res.status(200).send({ status: 'ok', stats: { totalUsers, activeMeters, pendingTickets }})

    } catch (error) {
       if(error.name == "JsonWebTokenError")
            return res.status(400).send({status: 'error', msg: 'Invalid token'})
    
        return res.status(500).send({status: 'error', msg:'Failed to load dashboard stats'})
    }
})

module.exports = router