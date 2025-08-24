const express = require('express')
const router = express.Router()

const dotenv = require('dotenv')
dotenv.config()

const jwt = require('jsonwebtoken')
const User = require('../models/user')


//Get all users
router.post('/users', async(req, res) =>{
    const {token} = req.body

    if(!token) {
        return res.status(400).send({status: 'error', msg: 'Token must be provided'})
    }

    try {
        //Verify the admin's token
        const admin = jwt.verify(token, process.env.JWT_SECRET)

        //Fetch all users
        const users = await User.find({}).lean()

        if (users.length === 0) {
            return res.status(200).send({status: "ok", msg: "No users found", users: []})
        }

        return res.status(200).send({status: "ok", msg: "Users retrieved successfully", users})
    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg:'Failed to fetch users', error: e.message})
    }  
})

//Get specific user
router.post('/user', async(req, res) => {
    const {token, userId} = req.body

    if(!token || !userId) {
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'})
    }

    try {
        //Verify the admin's token
        const admin = jwt.verify(token, process.env.JWT_SECRET)

        //Find the specific member
        const user = await User.findById(userId).lean()

        if (!user) {
            return res.status(400).send({status: 'error', msg: 'User not found'})
        }

        return res.status(200).send({status: 'ok', msg: 'User details retrieved successfully', user})
    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg:'Error fetching user', error: e.message})
    }  
})


//Update user details
router.post('/update', async(req, res) => {
    const {token, userId, updates} = req.body

    if(!token || !userId || !updates) {
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'})
    }

    try {
        //Verify the admin's token
        const admin = jwt.verify(token, process.env.JWT_SECRET)

        //Find the user and update his/her status
        const user = await User.findById(userId)

        if (!user) {
            return res.status(400).send({status: 'error', msg: 'User not found'})
        }

        Object.assign(user, updates) //Apply updates to the user object
        await user.save()

        return res.status(200).send({status: 'ok', msg: 'User updated successfully', user})
    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg:'An error occurred', error: e.message})
    }  
})


//Deactivate user
router.post('/deactivate', async(req, res) => {
    const {token, userId, reason} = req.body

    if(!token || !userId || !reason) {
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'})
    }

    try {
        //Verify the admin's token
        const admin = jwt.verify(token, process.env.JWT_SECRET)

        //Find the user
        const user = await User.findById(userId)

        if (!user) {
            return res.status(400).send({status: 'error', msg: 'User not found'})
        }

        //Add deactivation reason to a log or a field in the user schema
        user.status = 'Deactivated' //Optional: Add a status field to track deactivated/suspended users
        user.deactivationReason = reason //Optional: A field in the Member model
        await user.save()

        //Optionally, notify the user (if notification system exists)
        //eg., send an email or message with the reason

        return res.status(200).send({status: 'ok', msg: `User account deactivated successfully with reason: ${reason}`})
    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg:'Failed to deactivate user', error: e.message})
    }  
})

module.exports = router