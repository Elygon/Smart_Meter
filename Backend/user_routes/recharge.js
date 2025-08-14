const express = require('express')
const router = express.Router()

const dotenv = require('dotenv')
dotenv.config()

const jwt = require('jsonwebtoken')
const Recharge = require('../models/recharge')
const User = require('../models/user')
const SmartMeter = require('../models/smartMeter')


//Request recharge for a meter
router.post('/request', async(req, res) => {
    const {token, meterId, amount, paymentMethod, reference} = req.body

    if(!token, !meterId, !amount || !paymentMethod || !reference) {
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'})
    }

    try {
        //verify user's token
        const user = jwt.verify(token, process.env.JWT_SECRET)

        //Validate meter exists
        const meter = await SmartMeter.findById(meterId)
        if (!meter) {
            return res.status(400).send({status: 'error', msg: 'Meter not found'})
        }

        // Ensure user owns the meter
        if (meter.user.toString() !== user._id) {
            return res.status(400).send({status: 'error', msg: 'Unauthorized: This meter does not belong to you'}) 
        }

        const recharge = new Recharge()
        recharge.user = user._id
        recharge.meter = meterId
        recharge.amount = amount
        recharge.paymentMethod = paymentMethod
        recharge.reference = reference
        recharge.rechargeDate = new Date()
        recharge.rechargedBy = null, // since admin hasn't verified yet
        recharge.status = 'pending'

        await recharge.save()

        return res.status(200).send({status: 'success', msg: 'Recharge request submitted', recharge})

    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Invalid token or unauthorized access.', error: e.message})
        }
        return res.status(500).send({status: 'error', msg:'Failed to submit request', error: e.message})
    }
})


//View all recharge history for a user
router.post('/all', async(req, res) =>{
    const {token} = req.body

    if(!token) {
        return res.status(400).send({status: 'error', msg: 'Token must be provided'})
    }

    try {
        //Verify the user's token
        const user = jwt.verify(token, process.env.JWT_SECRET)

        //Fetch user's meter
        const meter = await SmartMeter.findOne({user: user._id})

        if (!meter) {
            return res.status(400).send({status: "error", msg: "No smart meter not found for this user"})
        }

        const recharges = await Recharge.find({meter: meter._id}).sort({createdAt: -1})

        if (!recharges || recharges.length === 0) {
            return res.status(400).send({status: "error", msg: "No recharge records found"})
        }

        return res.status(200).send({status: "ok", recharges})
    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Invalid token or unauthorized access.', error: e.message})
        }
        return res.status(500).send({status: 'error', msg:'Server error while fetching recharges', error: e.message})
    }  
})

//view specific recharge record
router.post('/view', async(req, res) => {
    const {token, id} = req.body

    if(!token, id) {
        return res.status(400).send({status: 'error', msg: 'All fields must be provided'})
    }

    try {
        //Verify the user's token
        const user = jwt.verify(token, process.env.JWT_SECRET)

        const recharge = await Recharge.findById(id).populate("meter")

        if (!recharge || !recharge.meter.user.toString() !== user._id.toString()) {
            return res.status(400).send({status: "error", msg: "Recharge not found or not yours"})
        }

        res.status(200).send({status: "success", recharge})
    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg: 'Failed to retrieve recharges', error: e.message})
    }  
})


//view recharge history of a user
router.post('/logs', async(req, res) => {
    const {token, user_id} = req.body

    if(!token || !user_id) {
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'})
    }

    try {
        //Verify the admin's token
        const admin = jwt.verify(token, process.env.JWT_SECRET)

        //Find the user
        const user = await User.findById(user_id)

        if (!user) {
            return res.status(400).send({status: 'error', msg: 'User not found.'})
        }

        const recharges = await Recharge.find({user: user_id}).populate("rechargeBy", "fullname")

        return res.status(200).send({status: 'success', user: user.fullname, recharges})
    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg: 'Failed to retrieve user recharges', error: e.message})
    }  
})

module.exports = router 