import React, { Component } from 'react';
import RolesTable from './RolesTable';

export default class ListRoles extends Component{
    constructor(props) {
        super(props);
        this.state = { roles: []};
    }

    componentDidMount(){
        fetch("/api/role")
        .then(results => {
            return results.json();
        }).then(roles => {
            this.setState({roles:roles});
        })
    }

    onAddRow = (row) => {
        fetch("/api/role", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(row),
        })
        .then(results => {
            return results.json();
        }).then(addedRole => {
            console.log("onAddRow", row, addedRole);
            this.setState({
              roles: this.state.roles.concat([addedRole])
            });
        })
    }

    onUpdateRow = (row) => {
        fetch("/api/role/" + row.id, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(row),
        })
        .then(results => {
            return results.json();
        }).then(updatedRole => {
            console.log("onUpdateRow", row, updatedRole, this.state.roles);
            let roles = this.state.roles.filter(r => {
                return r.id !== updatedRole.id;
             });

            this.setState({
              roles: roles.concat([updatedRole])
            });
        })
    }

    onDeleteRow = (rows) => {
        fetch("/api/role/" + rows[0], {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(rows[0]),
        }).then(results => {
            if(results.ok){
                console.log("onDeleteRow", rows[0]);
                const roles = this.state.roles.filter((role) => {
                  return role.id !== rows[0];
                });

                this.setState({
                  roles: roles
                });
            }
        })
    }

    render() {
        return(
            <RolesTable roles={this.state.roles}
                onAddRow={ this.onAddRow }
                onDeleteRow={ this.onDeleteRow }
                onUpdateRow = { this.onUpdateRow }
            />
        )
    }
}
