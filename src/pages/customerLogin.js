import React, { Component } from 'react'
import axios from 'axios'
import User from './customerPage'
import { Modal , ModalBody, ModalFooter,ModalHeader} from 'reactstrap'
import ReactNotification, { store } from 'react-notifications-component';
import { Input} from 'baseui/input'
import {Button} from 'baseui/button'
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
            store.addNotification({
                title: 'Error',
                message: 'Incorrect credentials',
                type: 'danger',
                container: 'top-center',
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
                container: 'top-center',
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
                message: 'Try another password',
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
           (             <div className = "mt-5" style= {{display: 'flex' , flexDirection : 'column', justifyContent :'center', alignItems : 'center'}}>
                            <div style={{width : '40vw'}}>

                                <h1 className="display-3">
                                    Welcome to LocDB!
                                </h1>
                                <h2>Login to continue</h2>
                                <h5>Enter name</h5>
                                <Input  onChange = {this.handlename}></Input>
                                <h5>Enter password</h5>
                                <Input  type="password" onChange = {this.handlepass}></Input><br></br>
                                <Button kind = "secondary" className="mt-3" onClick = {this.login}>Login</Button>
                                <p>
                                    <h2 className= "mt-5">
                                New User?<br></br>
                                
                                {
                                    !this.state.register && 
                                    <Button kind="secondary" onClick = {this.toggle}>Register Now</Button>

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
                                    {this.state.register && <h3>Registered successfully!</h3>}
                            </ModalBody>
                            <ModalFooter>
                                <Button onClick = {this.register}>Register</Button>
                                <Button kind="secondary" onClick={this.toggle}>Cancel</Button>
                        </ModalFooter>

                                </Modal>
                            </div>

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
