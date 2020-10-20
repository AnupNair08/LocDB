import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
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
                <h1>LocDB: A Taxi management service</h1>
                <h4>Choose user type</h4>
                <button onClick = {this.handlecust}>Customer</button>
                <button onClick = {this.handledriver}>Driver</button>
            </div>
        )
    }
}
