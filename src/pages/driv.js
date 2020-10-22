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

    decline = () => {
        console.log('Shit')
    }

    gettrips = () => {
        axios({
            method :'post',
            url : 'http://localhost:5000/api/getrequests',
            data : {
                taxi_id : this.state.taxi.data[0].taxi_id
            }
        }).then(res => {
            console.log(res)
            const data = res.data.data
            const c = this.state.code
            data.map((val,k) => {
                console.log(val)
                if(val.r[0].from_s != c){
                    console.log(val.from_s, c)
                    this.decline()
                }
            })
            this.setState({
                request : true,
                tripDetails : data
            })
        }).catch(e => {
            console.log(e)
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
                    <CardTitle className ="text-dark"><h2>My Profile</h2></CardTitle>
                    <ListGroup>
                    <ListGroupItem className="text-dark">Name: {this.props.data.d_name}</ListGroupItem>
                    <ListGroupItem className="text-dark">Phone Number: {this.props.data.d_phone_no}</ListGroupItem>
                    <ListGroupItem>
                <Button color="primary" onClick = {this.getloc}>Get Current Location</Button>
                {
                    this.state && this.state.myloc ? 
                        <h3 className= "text-dark"><img src = "https://i.pinimg.com/originals/29/93/fd/2993fd151e2e1cab871aec155e22cbcc.png" height="40px" width="30px"></img>   {this.state.myloc}</h3>
                    : <h3></h3>

                }
                    </ListGroupItem>
                    <ListGroupItem className="text-dark">Rating : {this.props.data.rating}<img src="https://i.pinimg.com/736x/68/9f/52/689f5245bf682fc77d8346f69e082fba.jpg"
                    height = "20px" width = "20px"></img></ListGroupItem>
                    <ListGroupItem className= "text-dark">
            My Shift : {this.state && this.state.shifts && <h4>{this.state.shifts[0].start}  {this.state.shifts[0].end}</h4>} 
                    </ListGroupItem>
                    <ListGroupItem>
                        <Location driver = {this.props.data.driver_id}/>    
                    </ListGroupItem>

                    </ListGroup>
                    
              </Card>

                </div>
                <h3>My Taxi</h3><br></br>
                <div style = {{display : 'flex', flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>

                    <img className="mr-5" src="https://img2.pngio.com/white-sedan-illustration-transparent-png-svg-vector-file-white-sedan-car-png-512_512.png" height="400px" width = "400px"></img>
                    <div className = "ml-5">

                    {
                        this.state && 
                        <h3 className="text-dark">
                        Volkswagen Vento<br></br>
                        {this.state.taxi.data[0].model}<br>
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
                                    <h3>{val.r[0].user_id}</h3> 
                                    <Button onClick = {() => this.approve(val.r[0].trip_id)}>Approve</Button>
                                    <Button onClick = {() => this.reject(val.r[0].trip_id)}>Approve</Button>

                                </div>
                            )
                        }) : <h1></h1>
                    }
                </div>
                     
                </div>
        )
    }
}
