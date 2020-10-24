import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import {Button} from 'baseui/button'
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
            <div style = {{display : 'flex', flexDirection:'row', justifyContent : 'center', alignItems:'center', height : '100vh'}} className="bg-dark">
                <div style = {{display : 'flex', flexDirection : "column", justifyContent : "center", alignItems : 'center'}} className = "mt-5">
                <h1 className="display-3 text-light">LocDB: A Taxi Management Service</h1>
                <img src="https://cdn2.iconfinder.com/data/icons/mobil-conveniences/100/tnv-512.png" height="200px" ></img>
                <h1 className="lead text-light">Choose user type</h1>
                <div style = {{display : 'flex' , flexDirection : 'column'}} >
                <Button kind="primary" onClick = {this.handlecust} className="lead">Customer</Button>
                <hr className="my-2" />
                <Button kind="primary" onClick = {this.handledriver } className="lead">Driver</Button>

                </div>

                </div>
            </div>
        )
    }
}
