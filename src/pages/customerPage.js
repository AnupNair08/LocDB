import React, { Component } from 'react'
import Header from './headerFile'
import axios from 'axios'
import {Jumbotron,} from 'reactstrap'
import UserLocation from './userTrip'
import {ListItem, ListItemLabel} from 'baseui/list'

export default class User extends Component {
    constructor(props){
        super(props)
        this.state = {
            user_id : this.props.data.user_id
        }
    }
    componentDidMount = async () => {
        await axios({
            method : 'get',
            url : 'http://localhost:5000/api/getnames'
        }).then(async res => {
            console.log(res)
            let lookup = {}
            await res.data.location.map((val,k) => {
                lookup[val.zipcode] = val.loc_name
            })
            console.log(lookup)
            this.setState({
                location : lookup
            })
        }).catch(e => {
            console.log(e)
        })
        await axios({
            method : 'post',
            url : 'http://localhost:5000/gettrips',
            data : {
                user_id : this.props.data.user_id
            }
        }).then((res) => {
            console.log(res)
            this.setState({
                trips : res.data.data
            })
        }).catch((e) => {
            console.log(e)
        })
    }
    
    render() {
        console.log(this.props)
        return (
            <div>
                <Header></Header>
                <Jumbotron style={{paddingLeft : "0", paddingRight : "0"}}>
                <img alt="avatar" src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png" height="200px" width = "200px"></img>
                    <h1 className="display-3">Hello, {this.props.data.name}</h1>
                    <p className="lead">LocDB lets you book a trip and see nearby taxis</p>
                    <hr className="my-2" />
                    <p>Try booking a trip now</p>
                    <p className="lead">
                    </p>
                <div>
                    <UserLocation></UserLocation>
                </div>
                <div>
                    <hr className="my-2" />
                    <h3 className="lead">My Trips</h3>
                    {this.state && this.state.trips && this.state.trips.map((v,k) =>{
                        return (<div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                            <div style={{width : '60vw'}}>
                            <ListItem>
                                <ListItemLabel>
                                        {k+1}. Trip {k+1}<br></br> 
                                </ListItemLabel>
                                <ListItemLabel>
                                        From: {this.state.location[v.from_s.toString()]}  To: {this.state.location[v.to_d.toString()]}<br></br>
                                </ListItemLabel>
                                <ListItemLabel>
                                    Fare: ₹{v.fare}
                                </ListItemLabel>
                            </ListItem>
                            </div>
                        </div>)
                    })}
                </div>
                </Jumbotron>
                {/* <h3>Hello {this.props.data.name}</h3> */}
            {/* </div> */}
            </div>
        )
    }
}
