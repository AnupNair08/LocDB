import React, { Component } from 'react'
import Header from './header'
import {ListGroup, ListGroupItem, Button, Dropdown, Card, CardTitle, CardText} from 'reactstrap'
import axios from 'axios'
import Location from './loc'
import ReactNotification, { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'

export default class DriverPage extends Component {
    getloc = () => {
        axios({
            method : 'post',
            url : 'http://localhost:5000/api/mylocation',
            data : {
                driver_id : this.props.data.driver_id
            }
        }).then((res) => {
            console.log(res)
            this.setState({
                myloc : res.data.data[0].loc_name,
                code : res.data.data[0].zipcode
            })
        }).catch(e => {
            console.log(e)
        })
    }
    componentDidMount = async () => {
        
        await axios({
            method : 'post',
            url : 'http://localhost:5000/gettaxi',
            data : {
                driver_id : this.props.data.driver_id
            }
        }).then((res) => {
            console.log(res)
            this.setState({
                taxi : res.data
            })
        }).catch(e => {
            console.log(e)
        })
    
        await axios({
            method : 'post',
            url : 'http://localhost:5000/api/getshift',
            data : {
                driver_id : this.props.data.driver_id
            }
        }).then((res) => {
            console.log(res)
            this.setState({
                shifts : res.data.shifts
            })
        })

        await this.getloc()
    }

    decline = (trip_id) => {
        axios({
            method :'post',
            url : 'http://localhost:5000/api/decline',
            data : {
                trip_id : trip_id
            }
        }).then(res => {
            console.log(res)
        }).catch(e => {
            console.log(e)
        })
    }

    getuser = async (user_id) => {
        const resp = await axios({
            method : 'post',
            url : 'http://localhost:5000/api/getuser',
            data : {
                user_id : user_id,
            }
        }).then(res => {
            console.log(res)
            const data = {
                name : res.data.data[0].name,
                phone : res.data.data[0].phone
            }
            console.log(data)
            return data
            // return <h3>{res.data.data[0].name}{res.data.data[0].phone}</h3>
        }).catch(e => {
            console.log(e)
        })
        return resp
    }

    gettrips = async () => {
        await axios({
            method :'post',
            url : 'http://localhost:5000/api/getrequests',
            data : {
                taxi_id : this.state.taxi.data[0].taxi_id
            }
        }).then(async (res) => {
            console.log(res)
            const data = res.data.data
            const c = this.state.code
            await data.map(async (val,k) => {
                const userVal = await this.getuser(val.r[0].user_id)
                // if(val.r[0].from_s == c){
                //     // this.decline(val.r[0].trip_id)
                //     tripDetails.push(val)
                // }
                console.log(userVal)
                val.r.push(userVal)
                val.r[0].user = userVal.name
                val.r[0].phone = userVal.phone

            })
            console.log(data)
            await this.setState({
                tripDetails : data
            })
        }).catch(e => {
            console.log(e)
        })
        this.setState({
            request : true
        })
    }
    

    approve = (trip) => {
        axios({
            method : 'post',
            url : 'http://localhost:5000/api/approve',
            data : {
                trip_id : trip,
                start : "09:10:00",
                end : "09:40:00",
                duration : "00:40:00",
                fare : 250
            }
        }).then(res => {
            console.log(res)
        }).catch(e => {
            console.log(e)
        }) 
    }

  
    render() {
        return (
            <div>
                <Header></Header>
                <ReactNotification />
                <div  style = {{display : 'flex', flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>

                <div style= {{display : 'flex' , flexDirection : 'column', justifyContent : 'center', alignItems : 'center'}}>
                <img src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png" height="200px" width = "200px"></img><br></br>
                    <h3>Hello {this.props.data.d_name}</h3>
                </div>
                <Card body inverse>
                    <CardTitle className ="text-dark"><h2><img src="https://media.istockphoto.com/vectors/worker-avatar-icon-illustration-police-man-bus-driver-vector-id1169147810?b=1&k=6&m=1169147810&s=612x612&w=0&h=vTIey0s-koGIXzYCMK26lza_hC2j5veslmcYN7boEew=" height="40px" width="40px"></img>  My Profile</h2></CardTitle>
                    <ListGroup>
                    <ListGroupItem  className="text-dark list-group-item list-group-item-action list-group-item-primary"><b>Name:</b> {this.props.data.d_name}</ListGroupItem>
                    <ListGroupItem className="text-dark list-group-item list-group-item-action list-group-item-primary"><b>Phone Number:</b> {this.props.data.d_phone_no}</ListGroupItem>
                    <ListGroupItem className="list-group-item list-group-item-action list-group-item-primary">
                <div style={{display : 'flex', flexDirection : 'row' ,justifyContent : 'center' , alignItems : 'center'}}>
                <Button color="primary" onClick = {this.getloc}>Get Current Location</Button>
                {
                    this.state && this.state.myloc ? 
                        <h3 className= "text-dark"><img src = "https://img.freepik.com/free-vector/location_53876-25530.jpg?size=338&ext=jpg" height="40px" width="40px"></img>   {this.state.myloc}</h3>
                    : <h3></h3>

                }
                </div>
                    </ListGroupItem>
                    <ListGroupItem className="list-group-item list-group-item-action list-group-item-primary" ><b>Rating: </b> {this.props.data.rating}<img className="ml-3" src="https://i.pinimg.com/originals/7e/28/89/7e288947c2c179f39398a72fdad19e0c.png"
                    height = "20px" width = "20px"></img></ListGroupItem>
                    <ListGroupItem className="list-group-item list-group-item-action list-group-item-primary text-dark">
                        <div>
            <b>My Shift: {this.state && this.state.shifts && <h4>{this.state.shifts[0].start} to  {this.state.shifts[0].end}</h4>} </b>
                        </div>
                    </ListGroupItem>
                    <ListGroupItem className="list-group-item list-group-item-action list-group-item-primary">
                        <Location driver = {this.props.data.driver_id}/>    
                    </ListGroupItem>

                    </ListGroup>
                    
              </Card>

                </div>
                <h3>My Taxi</h3><br></br>
                <div className="mt-0 pt-0 bg-dark text-light" style = {{display : 'flex', flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>

                    <img className="mr-5" src="https://img2.pngio.com/white-sedan-illustration-transparent-png-svg-vector-file-white-sedan-car-png-512_512.png" height="400px" width = "400px"></img>
                    <div className = "ml-5">

                    {
                        this.state && 
                        <h3>
                        Volkswagen Vento<br></br>
                        Type: {this.state.taxi.data[0].model}<br>
                        </br>Color : {this.state.taxi.data[0].color} <br></br>
                        Number : {this.state.taxi.data[0].number}</h3>
                    }
                    </div>
                </div>
                <div>
                    {/* Display the name and details */}
                    <Button color="primary" onClick = {this.gettrips}>Get Trip Requests</Button>
                    {
                        (this.state && this.state.request) ? this.state.tripDetails.map((val,k) => {
                            return (
                                <div>
                                    {console.log(val.r[1])}
                                    <h3>{val.r[0].user_id}</h3>
                                    <h3>val.r[0].user</h3>
                                    <h3>{val.r[0].phone}</h3>

                                    <Button color="success"onClick = {() => this.approve(val.r[0].trip_id)}>Approve</Button>
                                    <Button color="danger" onClick = {() => this.decline(val.r[0].trip_id)}>Reject</Button>

                                </div>
                            )
                        }) : <h1></h1>
                    }
                </div>
                     
                </div>
        )
    }
}
