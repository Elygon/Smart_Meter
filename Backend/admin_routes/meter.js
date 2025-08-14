const express = require('express')
const router = express.Router()

const dotenv = require('dotenv')
dotenv.config()

const jwt = require('jsonwebtoken')
const User = require('../models/user')
const SmartMeter = require('../models/smartMeter')


//endpoint for all meters (admin access)
router.post('/all', async(req, res) =>{
    const {token} = req.body

    if(!token) {
        return res.status(400).send({status: 'error', msg: 'Token must be provided'})
    }

    try {
        //Verify the admin's token
        const admin = jwt.verify(token, process.env.JWT_SECRET)

        //Fetch all meters
        const meters = await SmartMeter.find().populate("user", "fullname email")

        if (meters.length === 0) {
            return res.status(200).send({status: "ok", msg: "No meters found", meters: []})
        }
        
        return res.status(200).send({status: "success", meters})
    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Invalid token or unauthorized access.', error: e.message})
        }
        return res.status(500).send({status: 'error', msg:'An error occurred', error: e.message})
    }  
})

//endpoint for meter application review
router.post('/update', async(req, res) => {
    const {token, meterId, status} = req.body

    if(!token || !meterId || !status) {
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'})
    }

    try {
        //verify the admin's token
        const admin = jwt.verify(token, process.env.JWT_SECRET)

        const vStatus = ['approved', 'rejected', 'installed','active', 'inactive', 'faulty','disconnected']

        if(!vStatus.includes(status)) {
            return res.status(400).send({status: 'error', msg: 'Invalid status value'})
        }

        const meter = await SmartMeter.findById(meterId)
        if (!meter) {
            return res.status(400).send({status: 'error', msg: 'Meter not found'})
        }

        //Verb mapping to correct grammar
        const statusVerbs = {installed: 'install', active: 'activate'}
        const verb = statusVerbs[status] || status

        //Prevent skipping approval step
        if(meter.status === 'pending' && status === 'installed' || status === 'active') {
            return res.status(400).send({status: 'error', msg: `Cannot ${verb} a meter that is still pending. Approve it first.`})
        }
        
        if (meter.status === 'rejected' && status === 'installed' || status === 'active') {
            return res.status(400).send({status: 'error', msg: `Cannot ${verb} a meter that was rejected.`})
        }
        
        //Prevent re-approving already approved or installed meters
        if(meter.status === 'approved' && status === 'approved') {
            return res.status(400).send({status: 'error', msg: 'This meter application has already been approved and is awaiting installation.'})
        }

        // Prevent status update if meter already has a final status
        const fStatus = ['active', 'installed', 'rejected']
        if (fStatus.includes(meter.status)) {
            return res.status(400).send({status: 'error', msg: `This meter has already been processed. Current status: "$ {meter.status}"`})
        }
        meter.status = status
        await meter.save()
        
        return res.status(200).send({status: 'success', msg: `Meter status updated to "${status}"`, meter})
    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg: 'Error retrieving meter details.', error: e.message})
    }
})

//endpoint to assign meter number
router.post('/assign', async(req, res) => {
    const {token, meterId} = req.body

    if (!token || !meterId) {
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'})
    }
    
    try {
        const admin = jwt.verify(token, process.env.JWT_SECRET)

        const meter = await SmartMeter.findById(meterId)

        if (!meter) {
            return res.status(400).send({status: 'error', msg: 'Meter not found'})
        }

        // Only allow assignment if approved but not yet active
        if (meter.status !== 'approved') {
            return res.status(400).send({status: 'error', msg: 'Meter must be approved before assigning a meter number.'})
        }

        // Auto-generate unique meter number if not already assigned
        if (!meter.meterNumber) {
            let uniqueMeter
            do {
                const random = Math.floor(100000 + Math.random() * 900000) // 6-digit number
                uniqueMeter = `MTR-${random}`
            } while (await SmartMeter.findOne({ meterNmumber: uniqueMeter}))

                meter.meterNumber = uniqueMeter
        }

        /*// Optional: validate meterTech
        if (meterTech) {
            if (!['sts', 'iot'].includes(meterTech)) {
                return res.status(400).send({status: 'error', msg: 'Invalid meterTech. Use "sts" or "iot".'})
            }
            meter.meterTech = meterTech
        }*/

        await meter.save()

        return res.status(200).send({status: 'success', msg: 'Meter number assigned successfully.', meter})
    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg: 'Error retrieving meter details.', error: e.message})
    }
})

//endpoint for specific meter by ID
router.post('/specific', async(req, res) => {
    const {token, meterId} = req.body

    if(!token || !meterId) {
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'})
    }

    try {
        //Verify the admin's token
        const admin = jwt.verify(token, process.env.JWT_SECRET)

        const meter = await SmartMeter.findById(meterId).populate("user", "fullname email")

        if (!meter) {
            return res.status(400).send({status: 'error', msg: 'Meter not found'})
        }

        //Return the meter data
        return res.status(200).send({status: "success", meter})
    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg: 'Error retrieving meter details.', error: e.message})
    }  
})

//Delete a meter
router.post('/delete', async(req, res) => {
    const {token, meterId} = req.body

    try {
        const admin = jwt.verify(token, process.env.JWT_SECRET)

        const deleted = await SmartMeter.findByIdAndDelete(meterId)

        if(!deleted) {
            return res.status(400).send({msg: "Meter not found or already deleted."})
        }

        res.status(200).send({msg: "Meter deleted successfully."})
    } catch (e) {
    if (e.name === "JsonWebTokenError") {
        return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
    }
    return res.status(500).send({status: 'error', msg:'Failed to delete meter.', error: e.message})
}  
})


//Get logs for a meter
router.post('/logs', async(req, res) => {
    const {token, meterId} = req.body

    if(!token || !meterId) {
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'})
    }

    try {
        //Verify the admin's token
        const admin = jwt.verify(token, process.env.JWT_SECRET)

        //Find the meter 
        const meter = await SmartMeter.findById(meterId)

        if (!meter) {
            return res.status(400).send({status: 'error', msg: 'Meter not found.'})
        }

        return res.status(200).send({status: 'success', logs: meter.logs || [] }) //Return logs field
    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg:'Error fetching meter logs.', error: e.message})
    }  
})

module.exports = router