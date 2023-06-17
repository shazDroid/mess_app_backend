const mysql = require('mysql')

// Local
// const dbConnection = mysql.createConnection({
//     host:'localhost',
//     user:'root',
//     password:'',
//     database:'mess_app'
// })

Production
config
const dbConnection = mysql.createConnection({
    host:'sql.freedb.tech',
    user:'freedb_shazdroid',
    password:'7K6nbn8dMP@G*wR',
    database:'freedb_mess_app',
    port: 3306
})



module.exports = dbConnection