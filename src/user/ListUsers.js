import React, { Component } from 'react';
import NotificationSystem from 'react-notification-system';
import Constants from '../constants.js';
import UsersTable from './UsersTable'

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
        fetch("/api/user")
        .then(results => {
            return results.json();
        }).then(users => {
            this.setState({users:users});
        })
    }

    onAddRow = (row) => {
        fetch("/api/user", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(row),
        })
        .then(results => {
            return results.json();
        }).then(addedUser => {
            console.log("onAddRow", row, addedUser);
            this.setState({
              users: this.state.users.concat([addedUser])
            });
            this.notify(addedUser.name + " has been added");
        })
    }

    onUpdateRow = (row) => {
        fetch("/api/user/" + row.userId, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(row),
        })
        .then(results => {
            console.log("onUpdateRow", results);
            if(results.ok) {
                return results.json();
            }
            throw new Error("Could not update " + row.name + ": " + results.statusText);
        }).then(updatedUser => {
            console.log("onUpdateRow", row, updatedUser, this.state.users);
            let users = this.state.users.filter(u => {
                return u.userId !== updatedUser.userId;
             });

            this.setState({
              users: users.concat([updatedUser])
            });
            this.notify(updatedUser.name + " has been updated");
        }).catch(error => this.notify(error, Constants.notification.ERROR))
    }

    onDeleteRow = (rows) => {
        fetch("/api/user/" + rows[0], {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(rows[0]),
        }).then(results => {
            if(results.ok){
                console.log("onDeleteRow", rows[0]);
                const users = this.state.users.filter((user) => {
                  return user.userId !== rows[0];
                });

                this.setState({
                  users: users
                });
                this.notify(rows[0] + " has been deleted ")
            } else {
                this.notify("Failed to delete " + rows[0] + ": " + results.statusText, Constants.notification.ERROR)
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
        return(
            <div>
            <NotificationSystem ref="notificationSystem" />
            <UsersTable users={this.state.users}
                onAddRow = { this.onAddRow }
                onDeleteRow = { this.onDeleteRow }
                onUpdateRow = { this.onUpdateRow }
            />
            </div>

        )
    }
}
