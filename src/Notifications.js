import React, { Component } from 'react';
import NotificationSystem from 'react-notification-system';
import Constants from './constants.js';

export default class Notifications extends Component{
    render() {
        return(
                <NotificationSystem ref="notificationSystem" />
        )
    }

    constructor(props) {
        super(props);
        this._notificationSystem = null;
        this.notify = this.notify.bind(this);
    }
    componentDidMount(){
        this._notificationSystem = this.refs.notificationSystem;
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
    error = (reason) => this.notify(reason, Constants.notification.ERROR);
    success = (reason) => this.notify(reason, Constants.notification.SUCCESS);

}
