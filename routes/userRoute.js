const express = require('express')
const route = express.Router()

const {
    signUp,
    login
} = require('../controllers/userController')

route.post( '/' , signUp )
route.post( '/login' , login)

module.exports = route