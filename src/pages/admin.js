import React, { Component } from 'react'
import { Button, Input, Jumbotron, Modal, ModalBody, ModalFooter } from 'reactstrap'
import Header from './header'

export default class Admin extends Component {
    constructor(props){
        super(props)
        this.state = {
            open : false,
        }
    }
    toggle = () => {
        this.setState({
            open : !this.state.open
        })
    }
    setname = (e) => {
        this.setState({
            name : e.target.value
        })
    }
    setphone = (e) => {
        this.setState({
            phone : e.target.value
        })
    }
    setrating = (e) => {
        this.setState({
            rating : e.target.value
        })
    } 
    settaxinumber = (e) => {
        this.setState({
            txnum : e.target.value
        })
    }
    setcolor = (e) => {
        this.setState({
            color : e.target.value
        })
    }
    setmodel = (e) => {
        this.setState({
            model : e.target.value
        })
    }
    setclass = (e) => {
        this.setState({
            class : e.target.value
        })
    }
    setcapacity = (e) => {
        this.setState({
            capacity : e.target.value
        })
    }
    adddriver = () => {
        const driver_id = Math.floor(Math.random() * 1000000).toString()
        const taxi_id = "tx" + Math.floor(Math.random() * 10000).toString()
        const data = {
            driver_id : driver_id,
            taxi_id : taxi_id,
            d_name : this.state.name,
            d_phone_no : this.state.phone,
            rating : this.state.rating,
            number : this.state.number,
            color : this.state.color,
            model : this.state.model,
            cclass : this.state.class,
            capacity : this.state.capacity
        }
    }
    render() {
        return (
            <div>
                <Header></Header>
                <Modal isOpen={this.state.open} toggle={this.toggle}>
                    <ModalBody>
                        Enter Driver name: <Input onChange = {this.setname}></Input>
                        Enter Driver phone no.: <Input onChange = {this.setphone}></Input>
                        Enter Driver rating: <Input onChange = {this.setrating}></Input>
                        Enter Taxi Number: <Input onChange = {this.settaxinumber}></Input>
                        Enter Taxi Color: <Input onChange = {this.setcolor}></Input>
                        Enter Taxi Model: <Input onChange = {this.setmodel}></Input>
                        Enter Taxi Class: <Input onChange = {this.setclass}></Input>
                        Enter Taxi Capacity: <Input onChange = {this.setcapacity}></Input>

                    </ModalBody>
                    <ModalFooter>
                        <Button onClick = {this.toggle}>Done</Button>
                    </ModalFooter>
                </Modal>
                <Jumbotron style={{height : "100vh"}}>
                    <h1>Hello Admin</h1>
                    <Button onClick = {this.toggle}>Add driver</Button>
                </Jumbotron>
            </div>
        )
    }
}
