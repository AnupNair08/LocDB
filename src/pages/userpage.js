import React, { Component } from 'react'
import Header from './header'
import axios from 'axios'
export default class User extends Component {
    constructor(props){
        super(props)
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
                <div style= {{display : 'flex' , flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
                <img src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png" height="200px" width = "200px"></img>
                <h3>Hello [Username]</h3>
                </div>
                {/* <h3>Hello {this.props.data.name}</h3> */}
            </div>
        )
    }
}
