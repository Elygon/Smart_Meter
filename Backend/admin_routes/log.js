const express = require('express')
const router = express.Router()

const dotenv = require('dotenv')
dotenv.config()

const jwt = require('jsonwebtoken')
const Log = require('../models/log')
const SmartMeter = require('../models/smartMeter')



//Record log usage for a specific smart meter
router.post('/usage', async(req, res) => {
    const {token, id, unitsUsed} = req.body

    if(!token || !id || !unitsUsed) {
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'})
    }

    try {
        //verify the admin's token
        const admin = jwt.verify(token, process.env.JWT_SECRET)

        const meter = await SmartMeter.findById(id)

        if (!meter) {
            return res.status(400).send({status: 'error', msg: 'Meter not found'})
        }

        const isPrepaid = meter.meterType === 'prepaid'

        // For prepaid meters, balance must be enough
        if (isPrepaid) {
            if (meter.balance < unitsUsed) {
                return res.status(400).send({status: 'error', msg: `Insufficient balance. Meter has only ${meter.balance} units.`})
            }

            //Deduct usage
            meter.balance -= unitsUsed
            await meter.save()
        }

        // Create log entry
        const newLog = new Log()
        newLog.meter = meter._id
        newLog.event = 'usage'
        newLog.energyUsage = unitsUsed
        newLog.balance = meter.balance
        newLog.status = 'active'
        newLog.recordedBy = admin._id
        newLog.description = `Logged ${unitsUsed} kWh for ${isPrepaid ? 'prepaid' : 'postpaid'} meter.`
        newLog.timestamp = new Date()

        await newLog.save()

        return res.status(200).send({status: 'success', msg: `Usage of ${unitsUsed} kWh logged successfully`, balance: meter.balance})
    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg: 'Failed to retrieve logs', error: e.message})
    }
})

// Receive realtime energy usage from iot meters
router.post('/realtime', async (req, res) => {
    const {id, unitsUsed} = req.body

    if (!id || !unitsUsed) {
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'})
    }
    try {
        //verify the admin's token
        const admin = jwt.verify(token, process.env.JWT_SECRET)

        const meter = await SmartMeter.findById(id)

        if (!meter || meter.meterTech !== 'iot') {
            return res.status(400).send({status: 'error', msg:'Invalid or non-IoT meter.'})
        }

        const log = new Log()
        log.meter = meter._id
        log.user = meter.user
        log.energyUsage = unitsUsed
        log.event = 'usage'
        log.status = 'active'
        log.createdBy = null  // or 'system'

        await newLog.save()

        return res.status(200).send({status: 'success', msg: 'Real-time usage logged successfully', log})
    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg: 'Failed to log usage', error: e.message})
    }
})


//Get all logs for a specific smart meter
router.post('/all', async(req, res) => {
    const {token, id} = req.body

    if(!token || !id) {
        return res.status(400).send({status: 'error', msg: 'All fields must be provided'})
    }

    try {
        //Verify the admin's token
        const admin = jwt.verify(token, process.env.JWT_SECRET)

        const logs = await Log.find({smartMeter: id}).sort({timestamp: -1})

        if (!logs || logs.length === 0) {
            return res.status(400).send({status: "error", msg: "No logs found for this meter."})
        }

        return res.status(200).send({status: "ok", logs})
    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg: 'Failed to retrieve logs', error: e.message})
    }  
})


//view single log by ID
router.post('/view', async(req, res) => {
    const {token, id} = req.body

    if(!token || !id) {
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'})
    }

    try {
        //Verify the admin's token
        const admin = jwt.verify(token, process.env.JWT_SECRET)

        const log = await Log.findById(id).populate("smartMeter")

        if (!log) {
            return res.status(400).send({status: 'error', msg: 'Log not found.'})
        }

        return res.status(200).send({status: 'ok', log})
    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg: 'Failed to retrieve log.', error: e.message})
    }  
})


//Delete a specific log (if needed)
router.post('/delete', async(req, res) => {
    const {token, id} = req.body

    if (!token || !id) {
        return res.status(400).send({status: "error", msg: "All fields must be provided"})
    }
    try {
        const admin = jwt.verify(token, process.env.JWT_SECRET)

        const deleted = await Log.findByIdAndDelete(id)

        if(!deleted) {
            return res.status(400).send({msg: "Log not found or already deleted."})
        }

        res.status(200).send({status: "ok", msg: "Log deleted successfully."})
    } catch (e) {
    if (e.name === "JsonWebTokenError") {
        return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
    }
    return res.status(500).send({status: 'error', msg:'Failed to delete log.', error: e.message})
}  
})

module.exports = router