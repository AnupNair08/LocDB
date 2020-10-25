import React, { Component } from 'react'
import { Jumbotron, Spinner } from 'reactstrap'
import {Button } from 'baseui/button'
import {Input} from 'baseui/input'
import { Modal, ModalBody, ModalFooter} from 'baseui/modal'
import Header from './headerFile'
import axios from 'axios'
import ReactNotification, { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'

export default class Admin extends Component {
    constructor(props){
        super(props)
        this.state = {
            open : false,
            loading : false
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
    adddriver = async () => {
        const driver_id = Math.floor(Math.random() * 1000000).toString()
        const taxi_id = "tx" + Math.floor(Math.random() * 10000).toString()
        this.setState({
            loading : true
        })
        const data = {
            driver_id : driver_id,
            taxi_id : taxi_id,
            d_name : this.state.name,
            d_phone_no : this.state.phone,
            rating : this.state.rating,
            number : this.state.txnum,
            color : this.state.color,
            model : this.state.model,
            cclass : this.state.class,
            capacity : this.state.capacity
        }
        await axios({
            method : 'post',
            url : 'http://localhost:5000/api/addnew',
            data : data
        }).then(res => {
            console.log(res)
            this.toggle()
            this.setState({
                loading : false
            })
            store.addNotification({
                title : 'Added Successfully',
                message : 'Driver details updated',
                type : 'success',
                container: 'top-center',
                animationIn: ['animated', 'fadeIn'],
                animationOut: ['animated', 'fadeOut'],
                dismiss: {
                  duration: 3000,
                }
            })
        }).catch(e => {
            console.log(e)
            this.setState({
                loading : false
            })
            store.addNotification({
                title : 'Error',
                message : 'Try again',
                type : 'danger',
                container: 'top-center',
                animationIn: ['animated', 'fadeIn'],
                animationOut: ['animated', 'fadeOut'],
                dismiss: {
                  duration: 3000,
                }
            })
        })
    }
    render() {
        return (
            <div>
                <Header></Header>
                <ReactNotification></ReactNotification>
                <Modal isOpen={this.state.open} onClose={this.toggle}>
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
                        <Button onClick = {() => {this.adddriver()}}>{this.state.loading ? <Spinner size={48}></Spinner> : <h6>Done</h6>}</Button>
                        <Button onClick = {this.toggle}><h6>Cancel</h6></Button>
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
