import React, { Component } from 'react'
import axios from 'axios'
import { Dropdown, DropdownToggle, DropdownMenu,Button, Collapse, Card, CardBody, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ReactNotification, { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'

export default class UserLocation extends Component {
    constructor(props){
        super(props)
        this.state = {
            location : [],
            open : false,
            loc : '',
            endopen : false,
            nearby : [],
            request : false,
            endN : '',
            startN : '',
            isOpen : false,
            user_id : "123",
            approved : false,
            txmodal : false
        }
    }
    componentDidMount = async () => {
        await axios({
            method : 'post',
            url : 'http://localhost:5000/getlocation',
        }).then((res) => {
            console.log(res)
            this.setState({
                location : res.data.data
            })
        }).catch(e => {
            console.log(e)
        })
    }
    toggle = () => {
        this.setState({
            open : !this.state.open
        })
    }
    
    txmodal = () => {
        this.setState({
            txmodal : !this.state.txmodal
        })
    }
    endtoggle = () => {
        this.setState({
            endopen : !this.state.endopen
        })
    }
    getinput1 = (val,loc) => {
        console.log(this.state)
        this.setState({
            start : val,
            startN : loc
        })
        this.toggle()
    }

    gettaxi = () => {
        axios({
            method : 'post',
            url : 'http://localhost:5000/api/getnearby',
            data : {
                start : this.state.start
            }
        }).then((res) => {
            console.log(res)
            if(res.status === 200 && res.data.taxi.length !== 0){
                this.setState({
                    nearby : res.data.taxi
                })
            }
        }).catch(e => {
            console.log(e)
        })
    }
    
    getinput2 = (val,loc) => {
        console.log('end')
        this.setState({
            end : val,
            endN : loc
        })
        this.endtoggle()
    }

    toggleOpen = () => {
        this.setState({
            isOpen : !this.state.isOpen
        })
    }

    getreq = () => {
        axios({
            method:'post',
            url : 'http://localhost:5000/api/checkstatus',
            data : {
                user_id : this.state.user_id,
                trip_id : localStorage.getItem("last")
            }
        }).then(res => {
            if(res.data.msg === "approved"){
                console.log('trip was approved')
                this.setState({
                    approved : true
                })
                store.addNotification({
                    title: 'Request was approved by driver',
                    message: 'Taxi was booked',
                    type: 'success',
                    container: 'top-right',
                    animationIn: ['animated', 'fadeIn'],
                    animationOut: ['animated', 'fadeOut'],
                    dismiss: {
                    duration: 3000,
                    pauseOnHover: true
                }    
                })
                console.log('Approved')
            
            }
            else if(res.data.msg === "wait"){
                store.addNotification({
                    title: 'Waiting for driver confirmation',
                    message: 'Awaiting confirmation',
                    type: 'warning',
                    container: 'top-right',
                    animationIn: ['animated', 'fadeIn'],
                    animationOut: ['animated', 'fadeOut'],
                    dismiss: {
                    duration: 3000,
                    pauseOnHover: true
                }    
                })
                console.log('Wating')
                this.setState({
                    approved: false
                })
            }
            else{
                store.addNotification({
                    title: 'Trip declined',
                    message: 'Please book again',
                    type: 'danger',
                    container: 'top-right',
                    animationIn: ['animated', 'fadeIn'],
                    animationOut: ['animated', 'fadeOut'],
                    dismiss: {
                    duration: 3000,
                    pauseOnHover: true
                }    
                })
                console.log('Declined')
                this.setState({
                    approved: false
                })
            }
        })
    }

    book = (taxi) => {
        const trip_id = Math.floor(Math.random() * 1000000).toString()
        localStorage.setItem("last",trip_id)
        axios({
            method:'post',
            url : 'http://localhost:5000/api/booktrip',
            data : {
                user_id : "123",
                taxi_id : taxi,
                from_s : this.state.start,
                to_d : this.state.end,
                trip_id : trip_id
            }
        }).then((res) => {
            console.log(res)
            store.addNotification({
                title: 'Requested new ride',
                message: 'Waiting for Driver Confirmation',
                type: 'success',
                container: 'top-right',
                animationIn: ['animated', 'fadeIn'],
                animationOut: ['animated', 'fadeOut'],
                dismiss: {
                  duration: 3000,
                  pauseOnHover: true
                }
              });
              this.setState({
                  request : true
              })
        }).catch(e => {
            store.addNotification({
                title: 'Error',
                message: 'Try again',
                type: 'danger',
                container: 'top-right',
                animationIn: ['animated', 'fadeIn'],
                animationOut: ['animated', 'fadeOut'],
                dismiss: {
                  duration: 3000,
                  pauseOnHover: true
                }
              });
            console.log(e)
        })
    } 
    render() {
        return (
            <div>

            <div style= {{display : 'flex', flexDirection : 'column', justifyContent:'center', alignItems :'center'}}>
                <Button color="primary" className="lead" onClick={this.toggleOpen} style={{ marginBottom: '1rem' }}>Start a New Trip</Button>
                    <Collapse isOpen={this.state.isOpen}>
                        <Card>
                        <CardBody>
                        <div>
                    <h3 className="lead">Start</h3>
                 <Dropdown id="start" isOpen={this.state.open} toggle={this.toggle}>
                    <DropdownToggle caret>
                    {this.state.startN !== '' ? <h6>{this.state.startN}</h6> : <h6>Select Start</h6>}
                    {/* Select Start */}
                    </DropdownToggle>
                    <DropdownMenu>
                        {this.state.location && this.state.location.map((k,val) => {
                            return (
                                <div style = {{display : 'flex', flexDirection : 'row', justifyContent : 'center' , alignItems : 'center'}} className = "w-100">
                                    <Button color="white" onClick={() => this.getinput1(k.zipcode,k.loc_name)} header>{k.loc_name}</Button>
                                    <br></br>
                                </div>
                            ) 
                        })}
                    </DropdownMenu>
                </Dropdown>
                </div>
                    <div>
                    <h3 className="lead">End</h3>
                <Dropdown id = "end" isOpen={this.state.endopen} toggle={this.endtoggle}>
                   <DropdownToggle caret>
                {this.state.endN !== '' ? <h6>{this.state.endN}</h6> : <h6>Select End</h6>}
                {/* Select End */}

                    </DropdownToggle>
                <DropdownMenu>
                    {this.state.location && this.state.location.map((k,val) => {
                        return (
                            <div style = {{display : 'flex', flexDirection : 'row', justifyContent : 'center' , alignItems : 'center'}} className = "w-100">
                                <Button color="white" key={k} onClick={() => this.getinput2(k.zipcode,k.loc_name)} header>{k.loc_name}</Button>
                                <br></br>
                            </div>
                        ) 
                    })}
                    
                
                </DropdownMenu>
                </Dropdown>
                    </div>
                <Button color="success" className="mt-5" onClick = {() => {this.gettaxi(); this.txmodal()}}>
                    Check for taxis
                </Button>
                <Modal isOpen = {this.state.txmodal} toggle = {this.txmodal}>
                    <ModalHeader>
                        <img src="https://cdn4.iconfinder.com/data/icons/mobile-shopping-pack/512/gps-512.png" height="40px" width="40px"></img>    
                        Nearby Taxis
                    </ModalHeader>
                    
                    <ModalBody>
                        <h3 className="text-muted">Drivers within 3KM</h3>
                        {
                            !this.state.request && this.state.nearby.map((val,k) => {
                                return (
                                    <div style={{display : 'flex', flexDirection : 'column', justifyContent : 'center', alignItems : 'center'}}>
                                <h3 className="lead"><b>Driver Name:</b> {val.d_name}</h3>
                                <h3 className="lead"><b>Phone no:</b> {val.d_phone_no}</h3>
                                <h3 className="lead"><b>Model:</b> {val.model} Taxi number: {val.number} Color: {val.color}</h3>
                                    <Button onClick={() => this.book(val.taxi_id)}>Book</Button>
                                </div>
                            )

                        })
                        }
                    </ModalBody>
                <ModalFooter>
                    <Button onClick= {this.txmodal}>Done</Button>
                </ModalFooter>
                </Modal>
                        </CardBody>
                        </Card>
                    </Collapse>                      
            </div>
            <Button color="danger" onClick={this.getreq}>Check my Trip Requests</Button>
            {this.state.approved &&  <div>
                    Ongoing  Trip
                </div>}
            </div>
        )
    }

}
