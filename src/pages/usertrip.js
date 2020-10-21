import React, { Component } from 'react'
import axios from 'axios'
import { Dropdown, DropdownToggle, DropdownMenu,Button } from 'reactstrap';
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
            nearby : []
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
    getinput1 = (val) => {
        console.log(this.state)
        this.setState({
            start : val
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
    
    getinput2 = (val) => {
        console.log('end')
        this.setState({
            end : val
        })
        this.endtoggle()
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
                trip_id : "916"
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
        }).catch(e => {
            store.addNotification({
                title: 'Error',
                message: 'Try agian',
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
                <h3>Start a New Trip</h3>
                <div>
                 <Dropdown id="start" isOpen={this.state.open} toggle={this.toggle}>
                    <DropdownToggle caret>
                    {/* {this.state.start !== '' ? <h6>{this.state.start}</h6> : <h6>Select End</h6>} */}
                    Select Start
                    </DropdownToggle>
                    <DropdownMenu>
                        {this.state.location && this.state.location.map((k,val) => {
                            return (
                                <div style = {{display : 'flex', flexDirection : 'row', justifyContent : 'center' , alignItems : 'center'}} className = "w-100">
                                    <Button onClick={() => this.getinput1(k.zipcode)} header>{k.loc_name}</Button>
                                    <br></br>
                                </div>
                            ) 
                        })}
                    </DropdownMenu>
                </Dropdown>
                </div>

                <Dropdown id = "end" isOpen={this.state.endopen} toggle={this.endtoggle} className="mt-5">
                   <DropdownToggle caret>
                {/* {this.state.end !== '' ? <h6>{this.state.end}</h6> : <h6>Select End</h6>} */}
                Select End

                    </DropdownToggle>
                <DropdownMenu>
                    {this.state.location && this.state.location.map((k,val) => {
                        return (
                            <div style = {{display : 'flex', flexDirection : 'row', justifyContent : 'center' , alignItems : 'center'}} className = "w-100">
                                <Button key={k} onClick={() => this.getinput2(k.zipcode)} header>{k.loc_name}</Button>
                                <br></br>
                            </div>
                        ) 
                    })}
                    
                
                </DropdownMenu>
                </Dropdown>
                <Button className="mt-5" onClick = {this.gettaxi}>
                    Check for taxis
                </Button>
                {
                    this.state.nearby.map((val,k) => {
                        return (
                        <div>
                            <h1>{val.taxi_id}</h1>
                            <Button onClick={() => this.book(val.taxi_id)}>Book</Button>
                        </div>

                        )

                    })
                }
            </div>
        )
    }
}
