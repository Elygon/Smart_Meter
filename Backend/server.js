const express = require('express')
const app = express()

const dotenv = require('dotenv')
dotenv.config()

const mongoose = require('mongoose')
const cors = require('cors')
app.use(cors({origin: 'http://localhost:5173'}))

// connect database
mongoose.connect(process.env.MONGO_URI)
const con = mongoose.connection
con.on('open', error =>{
    if(error) {
        console.log(`Error connecting to database ${error}`)
    }else{
    console.log("Connected to Database")
    }
})

app.use(express.json())
app.use(express.urlencoded({extended: true}))


//user routes
app.use('/user_auth', require('./user_routes/auth'))
app.use('/user_meter', require('./user_routes/meter'))
app.use('/user_log', require('./user_routes/log'))
app.use('/user_notification', require('./user_routes/notification'))
app.use('/user_recharge', require('./user_routes/recharge'))
app.use('/user_contact', require('./user_routes/contact'))

//admin routes
app.use('/admin_auth', require('./admin_routes/auth'))
app.use('/admin_meter', require('./admin_routes/meter'))
app.use('/admin_log', require('./admin_routes/log'))
app.use('/admin_notification', require('./admin_routes/notification'))
app.use('/admin_recharge', require('./admin_routes/recharge'))
app.use('/admin_user', require('./admin_routes/user'))
app.use('/admin_reply', require('./admin_routes/reply'))


const port = process.env.PORT
app.listen(port , ()=>{
    console.log(`server listening at port ${port}`)
})

module.exports = app