import React, { Component } from 'react';
import Notifications from '../Notifications';
import Users from "./Users";
import { $users, $roles } from "../repository.js";
import UserDetails from "./UserDetails";


export class Index extends Component{
    render() {
        return(
            <div>
                <Notifications ref="notifications" />
                {this.getSelectedView()}
            </div>
        )
    }

    getSelectedView(){
        const viewId = this.state.viewId;
        if(viewId === "list") {
            return (
                <Users users={this.state.users} onDeleteUser={this.onDeleteUser} onCreateUser={this.createUser} onEditUser={this.editUser}/>
            )
        } else if(viewId === "create"){
            return (
                <UserDetails roles={this.state.roles} onSubmit={this.onCreateUser} notify={this.notify}/>
            )
        } else if(viewId === "edit"){
            return (
                <UserDetails user={this.state.selectedUser} roles={this.state.roles} onSubmit={this.onUpdateUser} notify={this.notify}/>
            )
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            roles: [],
            viewId: "list"
        }
    }

    componentDidMount(){
        this.notify = this.refs.notifications;
        this.loadAllUsers();
        this.loadAllRoles()
    }

    editUser = (user) => this.setState({viewId:"edit", selectedUser:user});

    createUser = () => this.setState({viewId:"create"});

    loadAllUsers = () => $users.getAll(this.afterLoadAllUsers, this.notify.error);

    loadAllRoles = () => $roles.getAll(this.afterLoadAllRoles, this.notify.error);

    onCreateUser = (newUser) => $users.create(newUser, this.afterAddUser, this.notify.error);

    onUpdateUser = (user) => $users.update(user, this.afterUpdateUser, this.notify.error);

    onDeleteUser = (user) => $users.remove(user, this.afterDeleteUser, this.notify.error);

    afterLoadAllUsers = (users) => {
        this.setState({
            viewId: "list",
            users: users
        });
    }

    afterLoadAllRoles = (roles) => {
        this.setState({
            roles: roles
        });
    }

    afterAddUser = (addedUser) => {
        this.setState({
            viewId: "list",
            users: this.state.users.concat([addedUser])
        });
        this.notify.success(addedUser.name + " has been added");
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
        this.notify.success(user.name + " has been updated");
    }

    afterDeleteUser = (user) => {
        const users = this.state.users.filter((u) => {
            return user.userId !== u.userId;
        });

        this.setState({
            users: users
        });
        this.notify.success(user.name + " has been deleted ")
    }

}
