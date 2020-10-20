const express = require('express')
const mysql = require('mysql')
const port = process.env.PORT || 5000
const app = express();
const cors = require("cors")
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
require('dotenv').config()

app.use(cors())

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

app.listen(port, () => {
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

app.post('/login', async (req,res) => {
    const {name, pass }= req.body
    connection.query(`SELECT * FROM user1 WHERE name="${name}" and user_id="${pass}";`, (e,op) => {
        if(e){
            console.log(e)
            return res.status(404).json({'msg': 'Some error occured' })
        }
        else{
            if(op.length === 0){
                console.log('yes')
                return res.status(200).json({'msg' : 'Invalid creds'})
            }
            else{
                return res.status(200).json({'msg': 'Success', data : op})
            }
        }
    })
})


app.post('/register', async (req,res) => {
    console.log(req.body)
    const {name, pass ,add, ph}= req.body
    q = `INSERT INTO user1 values("${pass}","${name}");INSERT INTO user2 values("${pass}","${ph}");INSERT INTO user3 values("${pass}","${add}");INSERT INTO user4 values("${ph}","${name}");`
    connection.query(`${q}`,[1,2,3,4] ,(e,op) => {
        if(e){
            console.log(e)
            return res.status(404).json({'msg': 'Some error occured' })
        }
        else{
                return res.status(200).json({'msg': 'Successfully Reigstered',})
        }
    })
})

app.post('/gettrips', async(req,res) => {
    const {user_id} = req.body
    connection.query(`SELECT * FROM trip3 WHERE user_id="${user_id}"`, (e,op) => {
        if(e){
            console.log(e)
            return res.status(404).json({'msg': 'Some error occured' })
        }
        else{
            if(op.length === 0) 
                return res.status(200).json({data: op})
            from = op[0].from_s 
            to = op[0],to_d
            connection.query(`SELECT * FROM trip2 WHERE from_s="${from}" and to_d="${to}"`, (e,opt) =>{
                console.log(opt)
            })
            return res.status(200).json({'msg': 'Sucess',data : op})
        }

    }) 
})