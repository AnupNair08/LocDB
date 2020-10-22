const router = require('express').Router()
const connection = require('./conn')

router.post('/mylocation', async (req,res) => {
    const {driver_id} = req.body
    console.log(driver_id)
    connection.query(`SELECT * from location where zipcode in (select zipcode from present_at where driver_id="${driver_id}");`, (e,op) => {
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
    
    connection.query(`UPDATE present_at set zipcode="${zipcode}" where driver_id="${driver_id}";UPDATE availability set zipcode="${zipcode}" WHERE taxi_id in (SELECT taxi_id from driver1 where driver_id ="${driver_id}")`, [1,2],(e,op) => {
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

router.post('/getnearby', async(req,res) => {
    const {start} = req.body
    
    connection.query(`SELECT taxi_id from availability where zipcode="${start}"`, (e,op) => {
        if(e){
            console.log(e)
            return res.status(404).json({'msg' : 'Error'})
        }
        else{
            return res.status(200).json({'msg' :'Success' , taxi : op})
        }
    })
})

router.post('/booktrip', async(req,res) => {
    const {user_id, taxi_id, from_s, to_d, trip_id} = req.body
    let driver_id = ""
    await connection.query(`SELECT driver_id from taxi1 where taxi_id="${taxi_id}"`, async (e,op)=>{
        if(e){
            return res.status(400).json({'msg' : 'Error'})
        }
        else{
            console.log(op)
            driver_id = op[0].driver_id
            console.log(driver_id)
            await connection.query(`INSERT INTO trip4 values("${trip_id}",1,FALSE,"${taxi_id}","${driver_id}")`, (e,op) => {
                if(e){
                    console.log(e)
                    return res.status(404).json({'msg' : 'Error'})
                }
                else{
                    return res.status(200).json({'msg' : 'Request made'})
                }
            })
        }
    })
    await connection.query(`INSERT INTO trip2 values("${from_s}","${to_d}","00:00:00",0);INSERT INTO trip3 values("${user_id}","${from_s}","${to_d}","${trip_id}");`,[1,2], (e,op) => {
        if(e){
            console.log(e)
            return res.status(404).json({'msg' : 'Error'})
        }
    })
    
})

router.post('/getrequests', async(req,res) => {
    const {taxi_id} = req.body
    connection.query(`SELECT * FROM trip4 WHERE taxi_id="${taxi_id}"`, async (e,op) => {
        if(e){
            console.log(e)
            return res.status(404).json({'msg' : 'Error'})
        }
        else{
            if(op.length > 0){
                let trip_id = ''
                let dataRes = []
                let k = op.length
                await op.map( async (val,key) => {
                    trip_id = val.trip_id
                    
                    await connection.query(`SELECT * FROM trip3 where trip_id="${trip_id}"`, (err, opt) => {
                        if(err){
                            console.log(err)
                            return res.status(404).json({'msg' : 'Lol'})
                        }
                        else{
                            let dataObj = {
                                r : opt
                            }
                            dataRes.push(dataObj)
                            if(k === key + 1){
                                return res.status(200).json({'msg':'Success',data : dataRes})
                            }
                            console.log(key,k)
                        } 
                    })
                })
        }
        else{
            return res.status(200).json({data : {}})
        }
        }
    })
})


router.post('/approve', async(req,res) => {
    const {trip_id, start, end,  duration, fare} = req.body
    let from_s = ''
    let to_d = ''
    await connection.query(`SELECT from_s, to_d from trip3 WHERE trip_id="${trip_id}"`,async (e,op) => {
        if(e){
            console.log(e)
            return res.status(400).json({'msg' : 'err'})
        }
        else{
            from_s = op[0].from_s
            to_d = op[0].to_d
            await connection.query(`UPDATE trip2 SET duration="${duration}",fare=${fare} WHERE from_s="${from_s}" and to_d="${to_d}";UPDATE trip4 SET status=TRUE WHERE trip_id="${trip_id}"`,[1,2], (e,op) => {
                if(e){
                    console.log(e)
                    return res.status(400).json({'msg' : 'err'})
                }
                else{
                    connection.query(`INSERT INTO trip1 values("${start}","${end}","${duration}","${trip_id}")`, (e,o) => {
                        if(e){
                            console.log(e)
                            return res.status(400).json({'msg' : 'err'})
                        }
                        else{
                            return res.status(200).json({'msg' : 'Accepted'})
                        }
                    })
                }
            })
        }
    })
    
})

module.exports = router