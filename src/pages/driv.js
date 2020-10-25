import React, { Component } from 'react'
import Header from './header'
import {ListGroup, ListGroupItem, CardTitle, Jumbotron, Input} from 'reactstrap'
import axios from 'axios'
import {Button} from 'baseui/button'
import {StarRating} from 'baseui/rating'
import {Card} from 'baseui/card'
import {Modal, ModalHeader, ModalFooter, ModalBody} from 'baseui/modal'
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
            this.modalOpen()
            store.addNotification({
                title: 'Ride Rejected',
                message: 'The trip has been rejected',
                type: 'warning',
                container: 'top-right',
                animationIn: ['animated', 'fadeIn'],
                animationOut: ['animated', 'fadeOut'],
                dismiss: {
                  duration: 3000,
                  pauseOnHover: true
                }
              });
            //   this.gettrips()
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
    
    curtrip = (val,user) => {
        this.setState({
            c : val,
            user : user
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
                duration : this.state.duration,
                fare : this.state.fare,
                user_id : this.state.user
            }
        }).then(res => {
            console.log(res)
            store.addNotification({
                title: 'Approved successfully',
                message: 'Ride has been accepted',
                type: 'success',
                container: 'top-right',
                animationIn: ['animated', 'fadeIn'],
                animationOut: ['animated', 'fadeOut'],
                dismiss: {
                  duration: 3000,
                  pauseOnHover: true
                }
              });
              this.detailtoggle()
        }).catch(e => {
            console.log(e)
        }) 
    }

    modalOpen = () => {
        this.setState({
            modal : !this.state.modal
        })
    }

    detailtoggle = () => {
        this.setState({
            detail : !this.state.detail
        })
    }

    getfare = (fare) => {
        this.setState({
            fare : fare.target.value
        })
    }
    
    getduration = (d) => {
        this.setState({
            duration : d.target.value
        })
    }
    render() {
        return (
            <div>
                <Header></Header>
                <Jumbotron className="pl-0 pr-0 pt-0">

                <div className="lead">
                    <ReactNotification />
                    <div  style = {{display : 'flex', flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>

                    <Card className="w-100" body inverse>
                    <div style= {{display : 'flex' , flexDirection : 'column', justifyContent : 'center', alignItems : 'center'}}>
                    <img src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png" height="200px" width = "200px"></img><br></br>
                        <h3>Hello {this.props.data.d_name}</h3>
                    </div>
                        <CardTitle className ="text-light"><h2 className="display-4">My Profile</h2></CardTitle>
                        <ListGroup>
                        <ListGroupItem  className="bg-dark text-light list-group-item list-group-item-action list-group-item-light"><b>Name:</b> {this.props.data.d_name}</ListGroupItem>
                        <ListGroupItem className="bg-dark text-light list-group-item list-group-item-action list-group-item-light"><b>Phone Number:</b> {this.props.data.d_phone_no}</ListGroupItem>
                        <ListGroupItem className="bg-dark  list-group-item list-group-item-action list-group-item-light">
                    <div style={{display : 'flex', flexDirection : 'row' ,justifyContent : 'center' , alignItems : 'center'}}>
                    <Button kind="secondary" className="mr-5" onClick = {this.getloc}>Get Current Location</Button>
                    {
                        this.state && this.state.myloc ? 
                            <h3 className= "text-light"><img src = "https://i.pinimg.com/originals/29/93/fd/2993fd151e2e1cab871aec155e22cbcc.png" height="40px" width="40px"></img>   {this.state.myloc}</h3>
                        : <h3></h3>

                    }
                    </div>
                        </ListGroupItem>
                        <ListGroupItem className="bg-dark text-light list-group-item list-group-item-action list-group-item-light" ><b>Rating: </b> <StarRating value={this.props.data.rating} readOnly></StarRating></ListGroupItem>
                        <ListGroupItem className="bg-dark text-light list-group-item list-group-item-action list-group-item-light">
                            <div>
                <b>My Shift: {this.state && this.state.shifts && <h4>{this.state.shifts[0].start} to  {this.state.shifts[0].end}</h4>} </b>
                            </div>
                        </ListGroupItem>
                        <ListGroupItem className="bg-dark text-light list-group-item list-group-item-action list-group-item-lighty">
                            <Location driver = {this.props.data.driver_id}/>    
                        </ListGroupItem>

                        </ListGroup>
                        
                </Card>

                    </div>
                    <Button color="primary" className="mb-5 mt-5" onClick = {() => {this.gettrips(); this.modalOpen()}}>Get Trip Requests</Button>

                    <h3>My Taxi</h3><br></br>
                    <div className="mt-0 pt-0 bg-dark text-light" style = {{display : 'flex', flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>

                        <img className="mr-5" src="https://img2.pngio.com/white-sedan-illustration-transparent-png-svg-vector-file-white-sedan-car-png-512_512.png" height="400px" width = "400px"></img>
                        <div className = "ml-5">

                        {
                            this.state && 
                            <h3>
                                <h4 className="display-4">
                            Volkswagen Vento<br></br>
                                </h4>
                            Type: {this.state.taxi.data[0].model}<br>
                            </br>Color : {this.state.taxi.data[0].color} <br></br>
                            Number : {this.state.taxi.data[0].number}</h3>
                        }
                        </div>
                    </div>
                    <div>
                        <Modal isOpen={this.state && this.state.detail} onClose={this.detailtoggle}>
                            <ModalHeader onClose={this.detailtoggle}>Approve the trip</ModalHeader>
                            <ModalBody>
                            <h3 className="lead">Trip ID: {this.state && this.state.c}</h3> 
                            <h3 className="lead">Enter Fare<Input onChange= {this.getfare}></Input></h3>
                            <h3 className="lead">Enter Duration(HH:MM:SS)<Input onChange = {this.getduration}></Input></h3>
                            </ModalBody>    
                            <ModalFooter>
                            <Button color="secondary" onClick={this.detailtoggle}>Cancel</Button>
                            <Button color="secondary" onClick={()=> this.approve(this.state.c, this.state.user)}>Aprove</Button>
                            </ModalFooter>
                        </Modal>
                        <Modal isOpen={this.state && this.state.modal} onClose={this.modalOpen} >
                            <ModalHeader toggle={this.modalOpen}>Active Trip Requests</ModalHeader>
                            <ModalBody>
                            {
                            (this.state && this.state.request && this.state.tripDetails) ? this.state.tripDetails.map((val,k) => {
                                return (
                                    <div>
                                        <h3>Trip ID: {val.r[0].user_id}</h3>
                                        <h3>{val.r[0].user && <h3>Name: {val.r[0].user}</h3>}</h3>
                                        <h3>{val.r[0].phone && <h3>Phone No: {val.r[0].phone}</h3>}</h3>
                                        <Button kind="secondary"onClick = {() => {this.curtrip(val.r[0].trip_id, val.r[0].user_id) ; this.detailtoggle()}}>Approve</Button>
                                        <Button kind="primary" className="text-dark" onClick = {() => this.decline(val.r[0].trip_id, val.r[0].user_id)}>Reject</Button>
                                    </div>
                                )
                            }) : <h1></h1>
                        }
                            </ModalBody>
                            <ModalFooter>
                            <Button color="secondary" onClick={this.modalOpen}>Cancel</Button>
                            </ModalFooter>
                        </Modal>
                        
                    </div>
                        
                    </div>
                
                </Jumbotron>
            </div>
        )
    }
}
