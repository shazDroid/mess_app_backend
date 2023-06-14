const express = require('express')
const app = express()
const env = require("dotenv").config()
const errorHandler = require('./middleware/errorHandler')
const port = process.env.PORT || 5000
const dbConnection = require('./config/dbConnection')


app.use(express.json())


dbConnection.connect((err) => {
    if(err){
        throw err
    } else {
        console.log("MySql connected");
    }
})

// ADMIN ROUTES
app.use("/api/admin",require('./routes/adminRoutes'))

// SUPERVISIOR ROUTES
app.use("/api/supervisior",require('./routes/supervisiorRoutes'))

app.use(errorHandler)


app.listen(port, () => {
    console.log("Server started listening on port " + port);
})