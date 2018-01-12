import React, { Component } from 'react';

export default class EditUser extends Component{
    constructor(props) {
        super(props);
        this.state = {
        }
        console.log("EditUser.constructor", this)
    };


    render(){
        console.log("EditUser.render", this.props, this.state);
        return (
            <h1>TBD</h1>
        )
    }
}