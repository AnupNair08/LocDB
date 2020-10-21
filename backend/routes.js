const router = require('express').Router()
const connection = require('./conn')

router.post('/mylocation', async (req,res) => {
    const {driver_id} = req.body
    console.log(driver_id)
    connection.query(`SELECT loc_name from location where zipcode in (select zipcode from present_at where driver_id="${driver_id}");`, (e,op) => {
        if(e){
            console.log(e)
            res.status(404).json({'msg' : "Error"})
        }
        else{
            res.status(200).json({'msg': 'Success', data: op})
        }
    })
})

module.exports = router