const mysql = require('mysql')
require('dotenv').config()
const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : process.env.DBpass,
    database : 'locdb',
    multipleStatements: true
})
connection.connect(e => {
    if(e){
        console.log(e)
    }
    else{
        console.log('Connected to MySQL Client')
    }
})

module.exports = connection