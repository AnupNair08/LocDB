import React, { Component } from 'react'
import DriverPage from './driv'
import { Card, Button, CardHeader, CardFooter, CardBody,
    CardTitle, CardText } from 'reactstrap';
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
                <div className = "mt-3" >
                            <h1 className="display-3">
                                Welcome to LocDB!
                            </h1>
                                <img src="https://dmm40cf0lyret.cloudfront.net/wp-content/uploads/2020/08/desarrollo-app-taxi.jpg" height= "400px" width="600px"></img>
                            <div>
                            <Card>
                                <CardHeader><h3>Login to continue</h3></CardHeader>
                                <CardBody>
                                <h2 className="lead">Enter name: 
                                <input style={{marginLeft : "45px"}} onChange = {this.handlename}></input>
                                </h2>
                                <h2 className="lead">Enter password:
                                <input className="ml-3" type="password" onChange = {this.handlepass}></input><br></br>

                                </h2>
                                </CardBody>
                                <CardFooter></CardFooter>
                            </Card>    
                            <Button color = "success" className="mt-3" onClick = {this.login}>Login</Button>
                            </div>
                    </div> : <DriverPage data = {this.state.data}/>
                }
            </div>
        )
    }
}
