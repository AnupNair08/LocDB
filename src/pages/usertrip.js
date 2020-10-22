import React, { Component } from 'react'
import axios from 'axios'
import { Dropdown, DropdownToggle, DropdownMenu,Button, Collapse, Card, CardBody } from 'reactstrap';
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
            isOpen : false
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
            if(res.status == 200 && res.data.taxi.length != 0){
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
    book = (taxi) => {
        axios({
            method:'post',
            url : 'http://localhost:5000/api/booktrip',
            data : {
                user_id : "123",
                taxi_id : taxi,
                from_s : this.state.start,
                to_d : this.state.end,
                trip_id : Math.floor(Math.random() * 1000000).toString()
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
            <div className="ml-5" style= {{width : '40vw', display : 'flex', flexDirection : 'column', justifyContent:'center', alignItems :'center'}}>
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
                <Button color="success" className="mt-5" onClick = {this.gettaxi}>
                    Check for taxis
                </Button>
                {
                    !this.state.request && this.state.nearby.map((val,k) => {
                        return (
                        <div>
                            <h1>{val.taxi_id}</h1>
                            <Button onClick={() => this.book(val.taxi_id)}>Book</Button>
                        </div>

                        )

                    })
                }
                        </CardBody>
                        </Card>
                    </Collapse>                      
            </div>
        )
    }

}
