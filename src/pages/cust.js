import React, { Component } from 'react'
import axios from 'axios'
import User from './userpage'

export default class Customer extends Component {
    constructor(props){
        super(props)
        this.state = {
            name : '',
            password : '',
            phno : '',
            add : '',
            login : false,
            register : false
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
        }).catch(e => {
            console.log(e)
        })
    }
    render() {
        return (
            <div>
                {
                    !this.state.login ? 
           (             <div>
                            <h1>
                                Welcome to LocDB!
                            </h1>
                            <h2>Login to continue</h2>
                            <p>Enter name</p>
                            <input onChange = {this.handlename}></input>
                            <p>Enter password</p>
                            <input onChange = {this.handlepass}></input><br></br>
                            <button onClick = {this.login}>Login</button>
                            <p>
                                <h2>
                            New User?<br></br>
                            Register Now
                                </h2>
                            </p>
                            <p>Enter name</p>
                            <input onChange = {this.handlename}></input>
                            <p>Enter password</p>
                            <input onChange = {this.handlepass}></input>
                            <p>Enter phone number</p>
                            <input onChange = {this.handleph}></input>
                            <p>Enter address</p>
                            <input onChange = {this.handleadd}></input>
                            <button onClick = {this.register}>Register</button>

                        </div>) : (
                            <div>
                                <User data = {this.state.data}></User>
                                {this.state.register && <h1>Hello! You are now registered.</h1>}

                            </div>
                        )

                }
            </div>

        )
    }
}
