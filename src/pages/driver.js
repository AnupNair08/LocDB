import React, { Component } from 'react'
import {Button} from  'reactstrap'
import DriverPage from './driv'
import axios from 'axios'
export default class Driver extends Component {
    constructor(props){
        super(props)
        this.state = {
            name : '',
            pass : '',
            login : false,
        }
    }
    handlename = (e) => {
        this.setState({name : e.target.value})
    }
    
    handlepass = (e) => {
        this.setState({password : e.target.value})
    }
    login = () => {
        axios({
            method : 'post',
            url : 'http://localhost:5000/logindriver',
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
    render() {
        return (
            <div>
                {
                    !this.state.login ? 
                <div className = "mt-5">
                            <h1>
                                Welcome to LocDB!(Driver Interface)
                            </h1>
                            <h2>Login to continue</h2>
                            <p>Enter name</p>
                            <input  onChange = {this.handlename}></input>
                            <p>Enter password</p>
                            <input  type="password" onChange = {this.handlepass}></input><br></br>
                            <Button color = "success" className="mt-3" onClick = {this.login}>Login</Button>
                    </div> : <DriverPage data = {this.state.data}/>
                }
            </div>
        )
    }
}
