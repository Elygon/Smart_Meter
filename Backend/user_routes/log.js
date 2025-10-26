const express = require('express')
const router = express.Router()

const dotenv = require('dotenv')
dotenv.config()

const jwt = require('jsonwebtoken')
const Log = require('../models/log')
const SmartMeter = require('../models/smartMeter')



//View all logs for the user's smart meter
router.post('/all', async(req, res) => {
    const {token} = req.body

    if(!token) {
        return res.status(400).send({status: 'error', msg: 'Token must be provided'})
    }

    try {
        //Verify the user's token
        const user = jwt.verify(token, process.env.JWT_SECRET)

        // Fetch all meters for this user
        const meters = await SmartMeter.find({user: user._id})

        if (!meters || meters.length === 0) {
            return res.status(200).send({status: "ok", logs: []}) // No meters, return empty logs
        }

        const meterIds = meters.map(m => m.id)

        // Fetch logs for all user's meters
        const logs = await Log.find({meter: { $in: meterIds }}).sort({createdAt: -1})

        return res.status(200).send({status: "ok", logs}) // logs may be empty array if none exist
    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg: 'Failed to retrieve logs', error: e.message})
    }  
})


//view specific log entry
router.post('/view', async(req, res) => {
    const {token, id} = req.body

    if(!token || !id) {
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'})
    }

    try {
        //Verify the user's token
        const user = jwt.verify(token, process.env.JWT_SECRET)

        const log = await Log.findById(id)

        if (!log) {
            return res.status(400).send({status: 'error', msg: 'Log not found.'})
        }

        const meter = await SmartMeter.findById(log.meter) // fetch the meter seperately

        if(!meter || meter.user.toString() !== user._id.toString()) {
            return res.status(400).send({status: 'error', msg: 'Log not found or not yours.'})
        }

        return res.status(200).send({status: 'ok', log})
    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg: 'Failed to retrieve log.', error: e.message})
    }  
})


module.exports = router