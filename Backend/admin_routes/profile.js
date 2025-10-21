const express = require('express')
const router = express.Router()

const dotenv = require('dotenv')
dotenv.config()

const jwt = require('jsonwebtoken')
const Admin = require('../models/admin')



//endpoint for profile
router.post('/', async(req, res) => {
    const {token} = req.body

    if(!token) {
        return res.status(400).send({status: 'error', msg: 'Token must be provided'})
    }

    try {
        //Verify the admin's token
        const admin = jwt.verify(token, process.env.JWT_SECRET)

        //Find admin in DB
        const Ladmin = await Admin.findById(admin._id).select("-password")
        if (!admin) {
            return res.status(400).send({status: "error", msg: "Admin not found"})
        }

        // Return admin info
        return res.status(200).send({status: 'ok', admin: Ladmin})
    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res.status(400).send({status: 'error', msg:'Token verification failed', error: e.message})
        }
        return res.status(500).send({status: 'error', msg:'Failed to fetch profile', error: e.message})
    }  
})


module.exports = router