import React, { Component } from 'react';
import {Button, ButtonToolbar} from 'react-bootstrap';
import NotificationSystem from 'react-notification-system';
import Constants from '../constants.js';
import UsersTable from "./UsersTable";
import { $users } from "../repository.js";
import AddUser from "./AddUser";
import EditUser from "./EditUser";

export default class Users extends Component{
    render() {
        return(
            <div>
                <NotificationSystem ref="notificationSystem" />
                {this.getSelectedView()}
            </div>
        )
    }

    getSelectedView(){
        const viewId = this.state.viewId;
        if(viewId === "list") {
            return (
                <div>
                    <UsersTable users={this.state.users} onDeleteUser={this.onDeleteUser} onEditUser={this.editUser}/>
                    <ButtonToolbar>
                        <Button onClick={this.addUser} bsSize="xsmall" >Ny Användare</Button>
                    </ButtonToolbar>
                </div>
            )
        } else if(viewId === "add"){
            return (
                <AddUser onSubmit={this.onAddUser}/>
            )
        } else if(viewId === "edit"){
            return (
                <AddUser user={this.state.selectedUser} userIdEditable={false} onSubmit={this.onUpdateUser}/>
            )
        }
    }

    constructor(props) {
        super(props);
        this._notificationSystem = null;
        // this.notify = this.notify.bind(this);
        this.onAddUser = this.onAddUser.bind(this);
        this.onError = this.onError.bind(this);
        this.editUser = this.editUser.bind(this);
        this.addUser = this.addUser.bind(this);
        this.state = {
            users: [],
            viewId: "list"
        }
    }

    componentDidMount(){
        this._notificationSystem = this.refs.notificationSystem;
        this.loadUsers();
    }

    loadUsers = () => $users.getAll((users) => this.setState({users:users}), this.onError);

    afterAddUser = (addedUser) => {
        this.setState({
            viewId: "list",
            users: this.state.users.concat([addedUser])
        });
        this.notify(addedUser.name + " has been added");
    }

    afterUpdateUser = (user) => {
        let users = this.state.users.filter(u => {
            return u.userId !== user.userId;
        });

        this.setState({
            viewId: "list",
            selectedUser:undefined,
            users: users.concat([user])
        });
        this.notify(user.name + " has been updated");
    }

    afterDeleteUser = (user) => {
        const users = this.state.users.filter((u) => {
            return user.userId !== u.userId;
        });

        this.setState({
            users: users
        });
        this.notify(user.name + " has been deleted ")
    }

    editUser = (user) => this.setState({viewId:"edit", selectedUser:user});

    addUser = () => this.setState({viewId:"add"});

    onAddUser = (newUser) => $users.create(newUser, this.afterAddUser, this.onError);

    onUpdateUser = (user) => $users.update(user, this.afterUpdateUser, this.onError);

    onDeleteUser = (user) => $users.remove(user, this.afterDeleteUser, this.onError);

    onError = (reason) => this.notify(reason, Constants.notification.ERROR);

    notify = (msg, level=Constants.notification.SUCCESS) => {
        this._notificationSystem.addNotification({
            title: level === Constants.notification.ERROR ? "Sorry, something went wrong!" : "",
            message: msg.toString(),
            level: level,
            position: "tc",
            autoDismiss: level === "error" ? 0 : 5
        });
    }

}
