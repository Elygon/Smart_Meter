const express = require('express')
const router = express.Router()

const dotenv = require('dotenv')
dotenv.config()

const jwt = require('jsonwebtoken')
const User = require('../models/user')



//endpoint for profile
router.post('/', async(req, res) => {
    const {token} = req.body

    if(!token) {
        return res.status(400).send({status: 'error', msg: 'Token must be provided'})
    }

    try {
        //Verify the user's token
        const user = jwt.verify(token, process.env.JWT_SECRET)

        
        //Find user in DB
        const Luser = await User.findById(user._id).select("-password")
        if (!Luser) {
            return res.status(400).send({status: "error", msg: "User not found"})
        }

        // Return user info
        return res.status(200).send({status: 'ok', user: Luser})
    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg:'Failed to fetch profile', error: e.message})
    }  
})


module.exports = router