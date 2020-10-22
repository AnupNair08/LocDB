import React, { Component } from 'react'
import axios from 'axios'
import { Dropdown, DropdownToggle, DropdownMenu,Button } from 'reactstrap';
import ReactNotification, { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'

export default class Location extends Component {
    constructor(props){
        super(props)
        this.state = {
            location : [],
            open : false,
            loc : '',
            driver_id : this.props.driver
        }
    }
    componentDidMount = async () => {
        await axios({
            method : 'post',
            url : 'http://localhost:5000/getlocation',
        }).then((res) => {
            console.log(res)
            this.setState({
                location : res.data.data
            })
        }).catch(e => {
            console.log(e)
        })
    }
    toggle = () => {
        this.setState({
            open : !this.state.open
        })
    }
    getinput = (val) => {
        this.setState({
            loc : 'val'
        })
        this.toggle()
        axios({
            method: 'post',
            url : 'http://localhost:5000/api/update',
            data : {
                driver_id : this.state.driver_id,
                zipcode : val
            }
        }).then((res) => {
            console.log(res)
            if(res.status === 200){
                store.addNotification({
                    title: 'Updated successfully',
                    message: 'Location changed',
                    type: 'success',
                    container: 'top-right',
                    animationIn: ['animated', 'fadeIn'],
                    animationOut: ['animated', 'fadeOut'],
                    dismiss: {
                      duration: 3000,
                      pauseOnHover: true
                    }
                  });
            }
        }).catch(e => {
            console.log(e)
            store.addNotification({
                title: 'Error',
                message: 'Try Again',
                type: 'danger',
                container: 'top-right',
                animationIn: ['animated', 'fadeIn'],
                animationOut: ['animated', 'fadeOut'],
                dismiss: {
                  duration: 3000,
                  pauseOnHover: true
                }
              });
        })
    }

    render() {
        return (
            <div>
                 <Dropdown isOpen={this.state.open} toggle={this.toggle}>
                   <DropdownToggle color="primary" caret>
                    Update Location
                    </DropdownToggle>
                <DropdownMenu>
                    {this.state.location && this.state.location.map((k,val) => {
                        return (
                            <div style = {{display : 'flex', flexDirection : 'row', justifyContent : 'center' , alignItems : 'center'}} className = "w-100">
                                <Button color="white" onClick={() => this.getinput(k.zipcode)} header>{k.loc_name}</Button>
                                <br></br>
                            </div>
                        ) 
                    })}
                    
                
                </DropdownMenu>
                </Dropdown>
            </div>
        )
    }
}
