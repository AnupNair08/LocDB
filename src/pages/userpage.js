import React, { Component } from 'react'
import Header from './header'
import axios from 'axios'
import {Jumbotron, Button} from 'reactstrap'
import UserLocation from './usertrip'
export default class User extends Component {
    constructor(props){
        super(props)
        this.state = {
            user_id : this.props.user_id
        }
    }
    componentDidMount = () => {
        // axios({
        //     method : 'post',
        //     url : 'http://localhost:5000/gettrips',
        //     data : {
        //         user_id : this.props.data.user_id
        //     }
        // }).then((res) => {
        //     console.log(res)
        // }).catch((e) => {
        //     console.log(e)
        // })
    }
    
    render() {
        console.log(this.props)
        return (
            <div>
                <Header></Header>
                {/* <div style= {{display : 'flex' , flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}> */}
                <Jumbotron style={{paddingLeft : "0", paddingRight : "0"}}>
                <img src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png" height="200px" width = "200px"></img>
                    <h1 className="display-3">Hello, [UserName]</h1>
                    <p className="lead">LocDB lets you book a trip and see nearby taxis</p>
                    <hr className="my-2" />
                    <p>Try booking a trip now</p>
                    <p className="lead">
                    </p>
                <div>
                    <UserLocation></UserLocation>
                </div>
                </Jumbotron>
                {/* <h3>Hello {this.props.data.name}</h3> */}
            {/* </div> */}
            </div>
        )
    }
}
