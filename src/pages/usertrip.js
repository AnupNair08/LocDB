import React, { Component } from 'react'
import axios from 'axios'
import { Dropdown, DropdownToggle, DropdownMenu  } from 'reactstrap';
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'baseui/modal'
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'
import {Card, StyledBody, StyledTitle} from 'baseui/card'
import { PaymentCard } from "baseui/payment-card";
import { StarRating } from "baseui/rating";
import {Drawer} from 'baseui/drawer'
import {Button} from 'baseui/button'

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
            user_id : this.props.data,
            approved : false,
            txmodal : false,
            endModal : false,
            card : "",
            rating : 1
        }
    }
    componentDidMount = async () => {
        await axios({
            method : 'get',
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

    getongoing = async (trip) => {
        console.log(trip)
        await axios({
            method : 'post',
            url : 'http://localhost:5000/api/curtrip',
            data : {
                trip_id : trip
            }
        }).then(res => {
            console.log(res)
            this.setState({
                ogtrip : res.data.ongoing[0]
            })
        }).catch(e => {
            console.log(e)
        })
    }
    getreq = async () => {
        if(localStorage.getItem("last") === null){
            await axios({
                method : 'post',
                url : 'http://localhost:5000/api/getongoing',
                data : {
                    user_id : this.state.user_id
                }
            }).then(res => {
                console.log(res.data.ongoing[0].trip_id)
                localStorage.setItem("last",res.data.ongoing[0].trip_id)
            }).catch(e => {
                console.log(e)
            })
        }
        axios({
            method:'post',
            url : 'http://localhost:5000/api/checkstatus',
            data : {
                user_id : this.state.user_id,
                trip_id : localStorage.getItem("last")
            }
        }).then(async res => {
            if(res.data.msg === "approved"){
                console.log('trip was approved')
                await this.getongoing(localStorage.getItem("last"))
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
                this.setState({
                    approved : true
                })
                localStorage.clear("last")
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
                    title: 'Oops no pending trips!',
                    message: 'There are no pending trips',
                    type: 'warning',
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
                // localStorage.clear("last")
            }
        })
    }

    toggleEnd = () => {
        this.setState({
            endModal : !this.state.endModal
        })
    }

    book = (taxi) => {
        const trip_id = Math.floor(Math.random() * 1000000).toString()
        console.log(this.props.data)
        localStorage.setItem("last",trip_id)
        axios({
            method:'post',
            url : 'http://localhost:5000/api/booktrip',
            data : {
                user_id : this.props.data,
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
    ratingChanged = (e) => {
        this.setState({
            rating : e.value
        })
    }

    parseDuration = (d) => {
        const h = d.slice(0,2)
        const m = d.slice(3,5)
        if(h === "00"){
            return `${m} Minute(s)`
        }
        return `${h} Hours ${m} Minute(s)`
    }

    parseZip = (z) => {
        const name = this.state.location.map((val,key) => {
            if(val.zipcode === z){
                return val.loc_name
            }
        })
        return name
    }

    done = () => {
        const data = {
            rating : this.state.rating,
            trip_id : this.state.ogtrip.trip_id
        }
        axios({
            method : 'post',
            url : 'http://localhost:5000/api/setrating',
            data : data
        }).then(res => {
            console.log(res)
            store.addNotification({
                title : 'Trip ended successfully',
                message : 'Thank you for the trip',
                type : 'success'
            })
            this.getongoing()
        }).catch(e => {
            console.log(e)
        })

    }

    setcard = (c) => {
        this.setState({
            card : c.target.value
        })
    }

    render() {
        return (
            <div>

            <div style= {{display : 'flex', flexDirection : 'column', justifyContent:'center', alignItems :'center'}}>
                <Button color="primary" className="lead" onClick={this.toggleOpen} style={{ marginBottom: '1rem' }}>Start a New Trip</Button>
                <Drawer
                    isOpen={this.state.isOpen}
                    autoFocus
                    onClose={this.toggleOpen}
                >
                <div style={{display : 'flex' , flexDirection : 'column', justifyContent : 'center', alignItems : 'center'}}>
                        <div>
                            <Dropdown id="start" isOpen={this.state.open} toggle={this.toggle}>
                                <DropdownToggle caret>
                                <h3 className="lead text-align-left">Source</h3>
                                {this.state.startN !== '' ? <h6>{this.state.startN}</h6> : <h6>Select Source</h6>}
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
                        <Dropdown className="mt-3" id = "end" isOpen={this.state.endopen} toggle={this.endtoggle}>
                        <DropdownToggle caret>
                        <h3 className="lead">Destination</h3>
                        {this.state.endN !== '' ? <h6>{this.state.endN}</h6> : <h6>Select Destination</h6>}
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
                <img alt="lib" className="mt-5" src="https://icon-library.com/images/location-icon-white-png/location-icon-white-png-12.jpg" height="200px" width="200px"></img>
                <Modal isOpen = {this.state.txmodal} toggle = {this.txmodal}>
                    <ModalHeader>
                        <img  alt="icon" src="https://cdn4.iconfinder.com/data/icons/mobile-shopping-pack/512/gps-512.png" height="40px" width="40px"></img>    
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
                </div>
                </Drawer>
                    {/* <Collapse isOpen={this.state.isOpen}>
                        <Card>
                        <CardBody>
                        </CardBody>
                        </Card>
                    </Collapse>                       */}
            </div>
            <Button kind="secondary" onClick={this.getreq} className="lead">Check my Trip Requests</Button>
            {this.state.approved &&  <div>
                <Card className="mt-5">
                    <StyledTitle>
                        <h3 className="display-4">Ongoing  Trip</h3>
                    </StyledTitle>
                        <StyledBody>
                            <div style={{display : 'flex',flexDirection : 'row', justifyContent :'center', alignItems:'center'}}>

                            <div style={{textAlign : 'left',  marginRight : "40px"}}>
                            
                            <h3><img alt="icon" src="https://www.pngkit.com/png/full/14-146161_white-location-icon-png-location-logo-png-white.png" height="40px" width="40px"></img> To: {this.parseZip(this.state.ogtrip.to_d)}</h3>
                            <h3><img alt="icon" src="https://www.pngkit.com/png/full/14-146161_white-location-icon-png-location-logo-png-white.png" height="40px" width="40px"></img> From: {this.parseZip(this.state.ogtrip.from_s)}</h3>
                            <h3><img alt="icon" src="https://icon-library.com/images/white-clock-icon-png/white-clock-icon-png-24.jpg" height="40px" width="40px"></img> Duration: {this.parseDuration(this.state.ogtrip.duration)}</h3>
                            <h3><img alt="icon" src="https://www.iconsdb.com/icons/preview/white/indian-rupee-xxl.png" height="40px" width="40px"></img> Fare: ₹{this.state.ogtrip.fare}</h3>
                            </div>
                            <div>
                                <img alt="icon" src="https://lh3.googleusercontent.com/proxy/QVUAYjrr_QYPjhA5SR2xzKzHNm2U-4adeBf4UstTHy7fEZheBzG21SQE1U5J2CpIfNwFSAZZiLmkYX3qr7P_OcFHyvQbRtIifSe36xewNeeP4_JV0bTv2_8H-GrDe65ouPewt1TfNgBWWisGtWKkQiLN" width="240px" height="100px"></img>
                            </div>
                            </div>
                        <Button onClick={this.toggleEnd}>End Trip</Button>
                        <Modal isOpen = {this.state.endModal} closeable animate autofocus onClose = {this.toggleEnd}>
                            <ModalHeader>Complete Trip</ModalHeader>
                            <ModalBody>
                                <h5 className="display-4">Thank you for riding with us.</h5>
                                <h5>Enter card number to complete payment</h5>
                                <PaymentCard 
                                clearOnEscape
                                placeholder="Please enter your credit card number..."
                                    value = {this.state.card}
                                    onChange = {this.setcard}
                                    >
                                </PaymentCard>
                            <h3>Rate your trip</h3>
                            <StarRating numItems={5} 
                                onChange={this.ratingChanged} 
                                size={32}
                                value = {this.state.rating}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="success" onClick = {() => {this.done() ;this.toggleEnd()}}>Done</Button>
                                <Button color = "primary" onClick={this.toggleEnd}>Cancel</Button>
                            </ModalFooter>
                        </Modal>
                        </StyledBody>
                </Card>
                </div>}
            </div>
        )
    }

}
