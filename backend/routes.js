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

router.post('/update', async(req,res) => {
    const {driver_id, zipcode} = req.body
    connection.query(`UPDATE present_at set zipcode="${zipcode}" where driver_id="${driver_id}"`, (e,op) => {
        if(e){
            console.log(e)
            return res.status(404).json({'msg' : 'Error'})
        }
        return res.status(200).json({'msg' : 'Success'})

    })
})

router.post('/getshift', async(req,res) => {
    const {driver_id} = req.body
    connection.query(`SELECT * FROM shifts where shift_id in (SELECT shift_id from works where driver_id="${driver_id}")`, (e,op) => {
        if(e){
            console.log(e)
            return res.status(404).json({'msg' : 'Error'})
        }
        else{
            return res.status(200).json({'msg' : 'Success', shifts : op})
        }
    })
})


module.exports = router