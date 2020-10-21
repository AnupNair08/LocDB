import React, { Component } from 'react'
import Header from './header'
import {ListGroup, ListGroupItem, Button, Dropdown, Card, CardTitle, CardText} from 'reactstrap'
import axios from 'axios'
import Location from './loc'
import ReactNotification, { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'

export default class DriverPage extends Component {
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
        
    }

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
                myloc : res.data.data[0].loc_name
            })
        }).catch(e => {
            console.log(e)
        })
    }
    render() {
        return (
            <div>
                <Header></Header>
                <ReactNotification />
                <div style = {{display : 'flex', flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>

                <div style= {{display : 'flex' , flexDirection : 'column', justifyContent : 'center', alignItems : 'center'}}>
                <img src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png" height="200px" width = "200px"></img><br></br>
                    <h3>Hello {this.props.data.d_name}</h3>
                </div>
                <Card body inverse>
                    <CardTitle className ="text-dark"><h2>My Profile</h2></CardTitle>
                    <ListGroup>
                    <ListGroupItem className="text-dark">Phone Number: {this.props.data.d_phone_no}</ListGroupItem>
                    {
                        this.state && 
                        <ListGroupItem className="text-dark">My Taxi: {this.state.taxi.data[0].model}[{this.state.taxi.data[0].color}] 
                        {this.state.taxi.data[0].number}</ListGroupItem>
                    }
                    <ListGroupItem className="text-dark">Rating : {this.props.data.rating}<img src="https://i.pinimg.com/736x/68/9f/52/689f5245bf682fc77d8346f69e082fba.jpg"
                    height = "20px" width = "20px"></img></ListGroupItem>
                    </ListGroup>
                    
              </Card>

                </div>
                <h3>My Location:</h3>
                <Button onClick = {this.getloc}>Get Current Location</Button>
                {
                    this.state && this.state.myloc ? 
                        <h3 className="mt-1"><img src = "https://i.pinimg.com/originals/29/93/fd/2993fd151e2e1cab871aec155e22cbcc.png" height="40px" width="30px"></img>   {this.state.myloc}</h3>
                    : <h3></h3>

                }
                <Location driver = {this.props.data.driver_id}/>    
                <h3>My Shift</h3>     
            {this.state && this.state.shifts && <h3>{this.state.shifts[0].start}  {this.state.shifts[0].end}</h3>}       
                </div>
        )
    }
}
