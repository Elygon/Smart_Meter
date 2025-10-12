const express = require('express')
const router = express.Router()

const dotenv = require('dotenv')
dotenv.config()

const jwt = require('jsonwebtoken')
const SmartMeter = require('../models/smartMeter')


//apply for new meter
router.post('/apply', async(req, res) =>{
    const {token, address, meterType, meterTech} = req.body

    if (!token || !address || !meterType || !meterTech) {
        return res.status(400).send({status: 'error', msg: 'All fields are required'})
    }

    try {
        //Verify user's token
        const user = jwt.verify(token, process.env.JWT_SECRET)

        // Prevent STS with postpaid
        if (meterTech === 'sts' && meterType !== 'prepaid') {
            return res.status(400).send({status: 'error', msg: 'STS meters only support prepaid type.'})
        }

        //Optional: Check if the user has already applied for a meter
        const eMeter = await SmartMeter.findOne({user: user._id}). sort({ createdAt: -1})

        //Any user that already has a meter cannot reapply
        /*if (eMeter && eMeter.status !== 'rejected') {
            let msg = 'You have already applied for a meter.'
            
            if (eMeter.status === 'pending') {
                msg = 'Your meter application is still pending.'
            } else if (eMeter.status === 'approved') {
                msg = 'Your meter application has been approved and is awaiting installation.'
            } else if (['installed', 'active'].includes(eMeter.status)) {
                msg =  'You already have an active meter.'
            }
            
            return res.status(400).send({status: 'error', msg})
        }
        */

        // If rejected or no meter exists, allow reapplication
        const meter = new SmartMeter()
        meter.user = user._id
        meter.address = address
        meter.meterType = meterType  // prepaid/postpaid
        meter.meterTech = meterTech  // sts/iot
        meter.status = 'pending' // Initial status
        meter.appliedAt = new Date()

        await meter.save()

        return res.status(200).send({status: 'success', msg: 'Meter application submitted successfully', meter})
    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg:'Error applying for meter', error: e.message})
    }
})


//endpoint for all meters belonging to logged-in user
router.post('/all', async(req, res) =>{
    const {token} = req.body

    if(!token) {
        return res.status(400).send({status: 'error', msg: 'Token must be provided'})
    }

    try {
        //Verify the user's token
        const user = jwt.verify(token, process.env.JWT_SECRET)

        //Fetch all meters associated with logged-in user
        const meters = await SmartMeter.find({user: user._id})

        //Check if the user has any meters
        if (meters.length === 0) {
            return res.status(200).send({status: "ok", msg: "No meters found for this user."})
        }

        //Return the meters associated with the logged-in user
        return res.status(200).send({status: "ok", meters})
    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg:'An error occurred', error: e.message})
    }  
})

//endpoint for specific meter by ID
router.post('/view', async(req, res) => {
    const {token, meterId} = req.body

    if(!token || !meterId) {
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'})
    }

    try {
        //Verify the user's token
        const user = jwt.verify(token, process.env.JWT_SECRET)

        //Find the specific meter by meterId and ensure it belongs to the logged-in user
        const meter = await SmartMeter.findById(meterId)

        if (!meter) {
            return res.status(400).send({status: 'error', msg: 'Meter not found'})
        }

        if (meter.user.toString() !== user._id.toString()) {
            return res.status(400).send({msg: "Unauthorized access to this meter."})
        }

        //Do not show the assigned meter number until the meter has been installed
        if (meter.status !== 'installed' && meter.status !== 'active') {
            meter.meterNumber = undefined
        }

        //Return the meter data
        return res.status(200).send({status: "success", meter})
    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg:'An error occurred', error: e.message})
    }  
})

//Get logs for a specific meter
router.post('/logs', async(req, res) => {
    const {token, meterId} = req.body

    if(!token || !meterId) {
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'})
    }

    try {
        //Verify the user's token
        const user = jwt.verify(token, process.env.JWT_SECRET)

        //Find the meter and update his/her status
        const meter = await SmartMeter.findById(meterId)

        if (!meter) {
            return res.status(400).send({status: 'error', msg: 'Meter not found'})
        }

        //Check if the meter belongs to the logged-in user
        if (meter.user.toString() !== user._id.toString()) {
            return res.status(400).send({msg: "Unauthorized access to this meter."})
        }
        
        //If logs exist in the meter document, return them
        if (meter.logs && meter.logs.length > 0) {
        return res.status(200).send({status: 'success', logs: meter.logs}) //Return logs field
        } else {
            return res.status(400).send({msg: "No logs available for ths meter"})
        }
    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg:'An error occurred', error: e.message})
    }  
})

module.exports = router