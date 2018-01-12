import React, { Component } from 'react';
import NotificationSystem from 'react-notification-system';
import Constants from '../constants.js';
import { Table, Button, ButtonToolbar } from 'react-bootstrap';
import { Link } from 'react-router-dom'

const rolesFormatter = (rowData) => (rowData.roles || []).map(r => r.rolename).join(', ');

export default class ListUsers extends Component{
    constructor(props) {
        super(props);
        this._notificationSystem = null;
        this.state = {
            users: []
        }
    }

    componentDidMount(){
        this._notificationSystem = this.refs.notificationSystem;
        this.loadUsers();
    }

    loadUsers = () => {
        fetch("/api/user")
        .then(results => {
            return results.json();
        }).then(users => {
            this.setState({users:users});
        })
    }

    onAddUser = (newUser) => {
        fetch("/api/user", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(newUser),
        })
        .then(results => {
            return results.json();
        }).then(addedUser => {
            console.log("onAddUser", newUser, addedUser);
            this.setState({
              users: this.state.users.concat([addedUser])
            });
            this.notify(addedUser.name + " has been added");
        })
    }

    onUpdateUser = (user) => {
        fetch("/api/user/" + user.userId, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(user),
        })
        .then(results => {
            console.log("onUpdateUser", results);
            if(results.ok) {
                return results.json();
            }
            throw new Error("Could not update " + user.name + ": " + results.statusText);
        }).then(updatedUser => {
            console.log("onUpdateUser", user, updatedUser, this.state.users);
            let users = this.state.users.filter(u => {
                return u.userId !== updatedUser.userId;
             });

            this.setState({
              users: users.concat([updatedUser])
            });
            this.notify(updatedUser.name + " has been updated");
        }).catch(error => this.notify(error, Constants.notification.ERROR))
    }

    onDeleteUser = (user) => {
        fetch("/api/user/" + user.userId, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(user.userId),
        }).then(results => {
            if(results.ok){
                console.log("onDeleteUser", user);

                const users = this.state.users.filter((u) => {
                  return user.userId !== u.userId;
                });

                this.setState({
                  users: users
                });
                this.notify(user.name + " has been deleted ")
            } else {
                this.notify("Failed to delete " + user.name + ": " + results.statusText, Constants.notification.ERROR)
            }
        })
    }

    notify = (msg, level=Constants.notification.SUCCESS) => {
        this._notificationSystem.addNotification({
            title: level === Constants.notification.ERROR ? "Sorry, something went wrong!" : "",
            message: msg.toString(),
            level: level,
            position: "tc",
            autoDismiss: level === "error" ? 0 : 5
        });
    }

    render() {
        const users = this.state.users;
        return(
            <div>
                <NotificationSystem ref="notificationSystem" />
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Användarid</th>
                            <th>Namn</th>
                            <th>Roller</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        { users.map(u =>
                            <tr key={u.userId}>
                                <td>{u.userId}</td>
                                <td>{u.name}</td>
                                <td>{(u.roles || []).map(r => r.rolename).join(', ')}</td>
                                <td>
                                    <div className="pull-right">
                                        <ButtonToolbar>
                                            <Link className="btn btn-primary btn-xs" to={`/user/edit/${u.userId}`}>Redigera</Link>
                                            <Button bsStyle="danger" bsSize="xsmall" onClick={()=>this.onDeleteUser(u)}>Ta bort</Button>
                                        </ButtonToolbar>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        )
    }
}
