import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import {Button} from 'reactstrap'
export default class Landing extends Component {
    constructor(props){
        super(props)
        this.state = {
            type : '',
        }
    }
    handlecust = () => {
        this.setState({type : "customer"})
    }
    
    handledriver = () => {
        this.setState({type : "driver"})
    }
    render() {
        console.log(this.state)
        if(this.state.type === "customer"){
            return <Redirect to="/customer" push></Redirect>
        }
        
        else if(this.state.type === "driver"){
            return <Redirect to="/driver" push></Redirect>
        }
        // {this.state.type === "driver" && <Redirect to="/driver"></Redirect>}
        return (
            <div>
                <div style = {{display : 'flex', flexDirection : "column", justifyContent : "center", alignItems : 'center'}} className = "mt-5">
                <h1>LocDB: A Taxi management service</h1>
                <img src="https://i.pinimg.com/originals/57/07/26/570726f9398849aa200fbcba9466f9f2.gif" height = {"200px"} width = {"450px"}></img>
                <h4>Choose user type</h4>
                <div style = {{display : 'flex' , flexDirection : 'row'}} className = "mt-5">
                <Button color="primary" onClick = {this.handlecust}>Customer</Button>
                <Button color="primary" onClick = {this.handledriver}>Driver</Button>

                </div>

                </div>
            </div>
        )
    }
}
