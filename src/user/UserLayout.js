import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import ListUsers from './ListUsers'


export default class UserLayout extends Component{
    render(){
        return (
            <Switch>
              <Route exact path='/user' component={ListUsers}/>
            </Switch>
        )
    }
}
