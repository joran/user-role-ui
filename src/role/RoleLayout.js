import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import ListRoles from './ListRoles';

export default class RoleLayout extends Component{
    render(){
        return (
               <Switch>
                 <Route exact path='/role' component={ListRoles}/>
               </Switch>
        )
    }
}

