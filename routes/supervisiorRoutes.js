const express = require('express')
const { loginSupervisior, addVehicle, getAllVehicles } = require('../controllers/supervisiorController')
const supervisiorRouter = express.Router()

supervisiorRouter.route('/login').post(loginSupervisior)
supervisiorRouter.route('/addVehicle').post(addVehicle)
supervisiorRouter.route('/getAllVehicles').post(getAllVehicles)


module.exports = supervisiorRouter