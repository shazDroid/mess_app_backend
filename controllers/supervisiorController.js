const asyncHandler = require('express-async-handler')
const dbConnection = require('../config/dbConnection')
const errorHandler = require('../middleware/errorHandler')

//@desc login supervisior 
//@route POST /api/supervisior/login
//@access Public
const loginSupervisior = asyncHandler(async (req, res) => {
    const { phoneNo, password } = req.body
    if (!phoneNo || !password) {
        res.status(400).json({ message: "All fields are required" })
    }

    let query = `SELECT * FROM supervisior 
    WHERE phone = '${phoneNo}'
    AND password = '${password}'
    LIMIT 1`

    dbConnection.query(query, (err, result) => {
        if (err) {
            console.log(err)
            res.status(200).json(err)
        } else {
            if (result == "") {
                res.status(401).json({ message: "No such user !" })
            } else {
                res.status(200).json(result)
            }
        }
    })
})


//@desc add vehicle
//@route POST /api/supervisior/addVehicle
//@access Public
const addVehicle = asyncHandler(async (req, res) => {
    const { supervisiorId, driverName, driverContactNo, vehicleNo, vehicleEmptyWeight, vehicleCapacity } = req.body

    let vehicleData = {
        supervisior_id: supervisiorId,
        driver_name: driverName,
        driver_phone_no: driverContactNo,
        vehicle_no: vehicleNo,
        vehicle_capacity: vehicleCapacity,
        vehicle_empty_weight: vehicleEmptyWeight
    }

    console.log(vehicleData);

    let query = `INSERT INTO vehicles set ?`

    dbConnection.query(query, vehicleData, (err, result) => {
        if (err) {
            res.status(403).json(err)
        } else {
            res.status(200).json({ message: "Vehicle added successfully !" })
        }
    })
})



//@desc get all vehicles
//@route POST /api/supervisior/getAllVehicles
//@access Public
const getAllVehicles = asyncHandler(async (req, res) => {
    const { supervisiorId } = req.body

    let query = `SELECT * FROM vehicles WHERE supervisior_id = ?`

    dbConnection.query(query, [supervisiorId], (err, result) => {
        if (err) {
            res.status(403).json(err)
        } else {
            res.status(200).json(result)
        }
    })
})







module.exports = { loginSupervisior, addVehicle, getAllVehicles }