const express = require('express')
const router = express.Router()

const dotenv = require('dotenv')
dotenv.config()

const jwt = require('jsonwebtoken')
const Recharge = require('../models/recharge')
const Admin = require('../models/admin')
const User = require('../models/user')
const SmartMeter = require('../models/smartMeter')
const Log = require('../models/log')
const Notification = require('../models/notification')
const mongoose = require('mongoose')

//Recharge a user's meter
router.post('/recharge', async(req, res) =>{
    const {token, user_id, amount, method} = req.body

    if(!token || !user_id || !amount || !method) {
        return res.status(400).send({status: 'error', msg: 'All fields must be provided'})
    }

    try {
        //Verify the admin's token
        const admin = jwt.verify(token, process.env.JWT_SECRET)

        //Find the user
        const user = await User.findById(user_id)
        
        if (!user) {
            return res.status(400).send({status: "error", msg: "User not found"})
        }

        //Fetch user's meter
        const meter = await SmartMeter.findOne({user: user._id})

        if (!meter) {
            return res.status(400).send({status: "error", msg: "Smart meter not found for this user"})
        }

        //Create a new recharge record
        const recharge = new Recharge()

        recharge.user = user._id
        recharge.meter = meter._id
        recharge.amount = amount
        recharge.method = method //method can be provided by the admin (e.g "Admin manual")
        recharge.rechargedBy = admin._id
        
        await recharge.save()

        return res.status(200).send({status: "success", msg: "Recharge recorded successfully", recharge})
    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Invalid token or unauthorized access.', error: e.message})
        }
        return res.status(500).send({status: 'error', msg:'Server error while processing recharge', error: e.message})
    }  
})

//approve or reject a recharge request
router.post('/update', async(req, res) => {
    const {token, rechargeId, action} = req.body

    if (!token || !rechargeId || !action) {
        return res.status(400).send({status: 'error', msg: 'All fields must be provided.'})
    }

    try {
        //verify the admin's token
        const admin = jwt.verify(token, process.env.JWT_SECRET)

        const recharge = await Recharge.findById(rechargeId)
        if (!recharge) {
            return res.status(400).send({status: 'error', msg: 'Recharge request not found.'})
        }

        const meter = await SmartMeter.findById(recharge.meter)
        if (!meter) {
            return res.status(400).send({status: 'error', msg: 'Meter not found.'})
        }


        // Prevent multiple approvals/rejections
        if  (['success', 'failed'].includes(recharge.status)) {
            return res.status(400).send({status: 'error', msg: `Recharge request has already been ${recharge.status}.`})
        }

        // Validate action
        if (!['approve', 'reject'].includes(action)) {
            return res.status(400).send({status: 'error', msg: 'Invalid action. Use "approve" or "reject".'})
        }

        // Reject request
        if (action === 'reject') {
            recharge.status = 'failed'
            recharge.rechargedBy = admin._id
            await recharge.save()

            await Notification.create({
                user: recharge.user,
                title: 'Recharge Rejected',
                message: 'Your recharge request has been rejected.',
                type: 'alert',
                createdBy: admin._id
            })

            return res.status(200).send({status: 'success', msg: 'Recharge request has been rejected.', recharge})
        }

        // Approve request
        if (action === 'approve') {
            //Validate STS meters must be prepaid
            if (meter.meterTech === 'sts' && meter.meterType !== 'prepaid') {
                return res.status(400).send({status: 'error', msg: 'STS meters must be prepaid only. Cannot approve this configuration.'})
            }

            recharge.status = 'success'
            recharge.rechargedBy = admin._id

            if (meter.meterTech === 'sts') {
                //Generate 20-digit token
                const token20 = Math.floor(10000000000000000000 + Math.random() * 9e19).toString()
                recharge.token = token20


                // Credit balance if prepaid
                if (meter.meterType === 'prepaid') {
                    const ratePerkWh = 350
                    const units = recharge.amount / ratePerkWh

                    meter.balance += units
                    await meter.save()

                    // Log the recharge
                    const log = new Log()
                    log.meter = meter._id
                    log.user = recharge.user
                    log.event = 'recharge'
                    log.energyUsage = 0
                    log.balance = meter.balance
                    log.status = 'active'
                    log.description = `Recharge of N${recharge.amount} credited ${units.toFixed(2)} kWh.`
                    log.createdBy = admin._id

                    await log.save()
                }

                // Send token notification
                const create = new Notification()
                create.user = recharge.user
                create.title = 'Recharge Token'
                create.message = `Your token is: ${token20}. Please enter it into your meter.`
                create.type = 'info'
                create.createdBy = admin._id
                
                await create.save()
            } else if (meter.meterTech === 'iot') {
                meter.balance += recharge.amount
                await meter.save()

                const create = new Notification()
                create.user = recharge.user
                create.title = 'Recharge Successful'
                create.message = `Your meter has been credited with N${recharge.amount}.`
                create.type = 'info'
                create.createdBy = admin._id
                
                await create.save()
            }

            await recharge.save()

            return res.status(200).send({status: 'success', msg: `Recharge request has been ${action === 'approve' ? 'approved' : 'rejected'} successfully.`, recharge})
        }

        return res.status(400).send({status: 'error', msg: 'Invalid action. Use "approve" or "reject".'})

    } catch (e){
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }

        return res.status(500).send({status: 'error', msg: 'An error occurred while reviewing the recharge request.', error: e.message})
    }
})


//view all recharge records
router.post('/all', async(req, res) => {
    const {token} = req.body

    if(!token) {
        return res.status(400).send({status: 'error', msg: 'Token must be provided'})
    }

    try {
        //Verify the admin's token
        const admin = jwt.verify(token, process.env.JWT_SECRET)

        const recharges = await Recharge.find().populate("user", "fullname email").populate("rechargedBy", "fullname")

        return res.status(200).send({status: "success", recharges})
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


//Mark a recharge as deleted
router.post('/invalid', async(req, res) => {
    const {token, rechargeId} = req.body

    if (!token || !rechargeId) {
        return res.status(400).send({status: "error", msg: "All fields must be provided"})
    }
    try {
        const admin = jwt.verify(token, process.env.JWT_SECRET)

        const updated = await Recharge.findOneAndUpdate({_id: rechargeId}, {deleted: true}, {new: true})

        if(!updated) {
            return res.status(400).send({msg: "Recharge not found"})
        }

        res.status(200).send({status: "ok", msg: "Recharge marked as invalid.", recharge: updated})
    } catch (e) {
    if (e.name === "JsonWebTokenError") {
        return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
    }
    return res.status(500).send({status: 'error', msg:'Failed to delete recharge record.', error: e.message})
}  
})


// Summary
router.post('/summary', async(req, res) =>{
    const {token} = req.body

    if(!token) {
        return res.status(400).send({status: 'error', msg: 'Token must be provided'})
    }

    try {
        //verify admin's token
        const admin = jwt.verify(token, process.env.JWT_SECRET)

        //Total summary
        const summary = await Recharge.aggregate([
            {$match: { deleted: false}},
            {$group: {_id: '$paymentMethod', total: {$sum: "$amount"}, count: {$sum: 1}}}
        ])

        //Total transaction
        const total = await Recharge.aggregate([
            {$match : {deleted: false}},
            {$group: {_id: null, totalAmount: { $sum: "$amount" }, totalTransactions: {$sum: 1}}}
        ])

        //Total count
        const statusCount = await Recharge.aggregate([
            {$match : {deleted: false}},
            {$group: {_id: '$status', count: {$sum: 1}}}
        ])
        
        res.status(200).send({status: 'success', 
            summary: {
                totalRechargedAmount: total[0]?.totalAmount || 0,
                totalTransactions: total[0]?.totalTransactions || 0,
                breakdownByPaymentMethod: summary,
                breakdownByStatus: statusCount
            }
        })

        } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg:'Error generating summary', error: e.message})
    }
})

module.exports = router