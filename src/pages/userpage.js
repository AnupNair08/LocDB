import React, { Component } from 'react'
import axios from 'axios'
export default class User extends Component {
    constructor(props){
        super(props)
    }
    componentDidMount = () => {
        axios({
            method : 'post',
            url : 'http://localhost:5000/gettrips',
            data : {
                user_id : this.props.data.user_id
            }
        }).then((res) => {
            console.log(res)
        }).catch((e) => {
            console.log(e)
        })
    }
    render() {
        console.log(this.props)
        return (
            <div>
                <h3>Hello {this.props.data.name}</h3>
            </div>
        )
    }
}
