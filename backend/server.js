const express = require('express')
const mysql = require('mysql')
const port = process.env.PORT || 5000
const app = express();
require('dotenv').config()

const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : process.env.DBpass,
    database : 'locdb'
})
connection.connect(e => {
    if(e){
        console.log(e)
    }
    else{
        console.log('Connected to MySQL Client')
    }
})

app.listen(port, () => {
    console.log(process.env.DBpass)
    console.log(`Listening to ${port}`)
})

app.get('/',()=>{
    connection.query('SELECT * FROM user1', (e,res) =>{
        if(e){
            console.log(e)
        }
        else{
            console.log(res)
        }
    })
})
