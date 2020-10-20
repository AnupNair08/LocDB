import React, { Component } from 'react'
import axios from 'axios'
import User from './userpage'
import {Button, Modal , ModalBody, ModalFooter, Input ,ModalHeader} from 'reactstrap'
import ReactNotification, { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'
export default class Customer extends Component {
    constructor(props){
        super(props)
        this.state = {
            name : '',
            password : '',
            phno : '',
            add : '',
            login : false,
            register : false,
            modal : false
        }
    }
    handlename = (e) => {
        this.setState({name : e.target.value})
    }
    
    handlepass = (e) => {
        this.setState({password : e.target.value})
    }
    
    handleadd = (e) => {
        this.setState({add : e.target.value})
    }
    
    handleph = (e) => {
        this.setState({phno : e.target.value})
    }
    toggle = () => {
        this.setState({
            modal : !this.state.modal
        })
    }
    login = () => {
        axios({
            method : 'post',
            url : 'http://localhost:5000/login',
            data : {
                name : this.state.name,
                pass : this.state.password
            }
        }).then((res) => {
                if(res.status === 200 && res.data.length !== 0){
                    const data = res.data.data[0]
                    this.setState({
                        login : true,
                        data : data
                    })
                }
                console.log(res)
        }).catch(e => {
            console.log(e)
        })
    }

    register = () => {
        const data = {
            name : this.state.name,
            pass : this.state.password,
            add : this.state.add,
            ph : this.state.phno
        }
        console.log(data)
        axios({
            method : 'post',
            url : 'http://localhost:5000/register',
            data : data
        }).then((res) => {
            console.log(res)
            this.toggle()
            store.addNotification({
                title: 'Successfully Registered',
                message: 'Login to your Account',
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
            console.log(e)
            this.toggle()
            store.addNotification({
                title: 'Error',
                message: 'Try Again',
                type: 'danger',
                // insert: "top",
                container: 'top-right',
                animationIn: ['animated', 'fadeIn'],
                animationOut: ['animated', 'fadeOut'],
                dismiss: {
                  duration: 3000,
                  pauseOnHover: true
                }
              });
        })
    }
    render() {
        return (
            <div>
                <ReactNotification />
                {
                    !this.state.login ? 
           (             <div className = "mt-5">
                            <h1>
                                Welcome to LocDB!
                            </h1>
                            <h2>Login to continue</h2>
                            <p>Enter name</p>
                            <input  onChange = {this.handlename}></input>
                            <p>Enter password</p>
                            <input  type="password" onChange = {this.handlepass}></input><br></br>
                            <Button color = "success" className="mt-3" onClick = {this.login}>Login</Button>
                            <p>
                                <h2 className= "mt-5">
                            New User?<br></br>
                            
                            {
                                !this.state.register && 
                                <Button color="primary" onClick = {this.toggle}>Register Now</Button>

                            }
                                </h2>
                            </p>
                            <Modal isOpen={this.state.modal} toggle={this.toggle} >
                            <ModalHeader toggle={this.state.toggle}>Register to LocDB</ModalHeader>
                            <ModalBody>
                                <p>Enter name</p>
                                <Input onChange = {this.handlename}></Input>
                                <p>Enter password</p>
                                <Input onChange = {this.handlepass}></Input>
                                <p>Enter phone number</p>
                                <Input onChange = {this.handleph}></Input>
                                <p>Enter address</p>
                                <Input onChange = {this.handleadd}></Input><br></br>
                                <Button onClick = {this.register}>Register</Button>
                                {this.state.register && <h3>Registered successfully!</h3>}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                       </ModalFooter>

                            </Modal>

                        </div>) : (
                            <div>
                                <User data = {this.state.data}></User>

                            </div>
                        )

                }
            </div>

        )
    }
}
