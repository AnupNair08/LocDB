import React, { Component } from 'react'
import Header from './header'
import {ListGroup, ListGroupItem} from 'reactstrap'
import axios from 'axios'
export default class DriverPage extends Component {
    componentDidMount = () => {
        axios({
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
    }
    render() {
        return (
            <div>
                <Header></Header>
                <div style= {{display : 'flex' , flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
                <img src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png" height="200px" width = "200px"></img>
                <h3>Hello [Driver]</h3>
                </div>
                <h3>
                    My Profile
                </h3>
                <ListGroup>
                <ListGroupItem>Phone Number: {this.props.data.d_phone_no}</ListGroupItem>
                {/* {this.state && console.log(this.state.taxi.data[0].model)} */}
                {
                    this.state && 
                    <ListGroupItem>My Taxi: {this.state.taxi.data[0].model}[{this.state.taxi.data[0].color}] 
                    {this.state.taxi.data[0].number}</ListGroupItem>
                }
                <ListGroupItem>Rating : {this.props.data.rating}</ListGroupItem>
                </ListGroup>
            </div>
        )
    }
}
