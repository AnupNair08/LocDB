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
                <h1 className="display-3">LocDB: A Taxi management service</h1>
                <img src="https://i.pinimg.com/originals/57/07/26/570726f9398849aa200fbcba9466f9f2.gif" height = {"200px"} width = {"450px"}></img>
                <h1 className="lead">Choose user type</h1>
                <div style = {{display : 'flex' , flexDirection : 'column'}} className = "mt-5">
                <Button color="primary" onClick = {this.handlecust} className="lead">Customer</Button>
                <hr className="my-2" />
                <Button color="primary" onClick = {this.handledriver } className="lead">Driver</Button>

                </div>

                </div>
            </div>
        )
    }
}
