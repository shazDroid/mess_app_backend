const mysql = require('mysql')

// Local
const dbConnection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'mess_app'
})

// Production
// config
// const dbConnection = mysql.createConnection({
//     host:'b28gqblnigktl0jampug-mysql.services.clever-cloud.com',
//     user:'ugcqjx9fywbod9xv',
//     password:'8Q9COQqREeFkP1CQT8KP',
//     database:'b28gqblnigktl0jampug',
//     port: 3306
// })



module.exports = dbConnection