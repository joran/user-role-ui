import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import NotificationSystem from 'react-notification-system';
import Constants from '../constants.js';

class RolesEditor extends Component {
    constructor(props) {
        console.log("RolesEditor:consructor", props)
        super(props);
        this.updateData = this.updateData.bind(this);
        this.onChange = this.onChange.bind(this);
        this.state = {allroles: [], roles: props.defaultValue||[]};
    }

    componentDidMount(){
        console.log("RolesEditor:componentDidMount")
        fetch("/api/role")
        .then(results => {
            return results.json();
        }).then(data => {
            this.setState({allroles:data, roles:this.state.roles});
        })
    }

    getFieldValue(){
        return this.state.roles;
    }

    updateData() {
        this.props.onUpdate(this.state.roles);
    }

    close = () => {
        this.setState({ open: false });
        this.props.onUpdate(this.props.defaultValue||[]);
    }

    onBlur(event) {
        console.log("handleBlur", event);
    }
    onChange(event) {
        const roleId = event.currentTarget.name;
        const role = this.state.allroles.find(r => r.id === roleId);
        let currentRoles = this.state.roles;

        if (currentRoles.indexOf(role) < 0) {
            currentRoles = currentRoles.concat([ role ]);
        } else {
            currentRoles = currentRoles.filter(r => r !== role);
        }
        this.setState({roles:currentRoles, allroles:this.state.allroles});
    }

    _hasRole(role) {
        return this.state.roles.map(r => r.id).indexOf(role.id) > -1;
    }
    render() {
        console.log("RolesEditor:render")
        let buttons;
        if(this.props.defaultValue){
            buttons = (
              <div>
                  <button type='button' className='btn btn-primary btn-xs' onClick={ this.updateData }>Save</button>
                  <button type='button' className='btn btn-default btn-xs' onClick={ this.close }>Close</button>
              </div>
            )
        }
        const roleCheckBoxes = this.state.allroles.map(role => (
          <div key={ `span-${role.id}` }>
            <input
              type='checkbox'
              key={ role.id }
              name={ role.id }
              checked={ this._hasRole(role) }
              onKeyDown={ this.props.onKeyDown }
              onChange={ this.onChange } />
            <label key={ `label-${role}` } htmlFor={ role.id }> { role.rolename } </label>
          </div>
        ));

        return (
          <div ref='inputRef' tabIndex="0" onBlur={this.onBlur}>
            { roleCheckBoxes }
            { buttons }
          </div>
        );
    }

}


const createRolesEditor = (onUpdate, props) => (<RolesEditor onUpdate={ onUpdate } {...props}/>);

const rolesFormatter = (roles, row) => (<span>{ (roles || []).map(r => r.rolename).join(', ') }</span>);

const rolesSortFunc = (a, b, order) => {   // order is desc or asc
  const aValue = a.roles.map(r => r.rolename).join(',');
  const bValue = b.roles.map(r => r.rolename).join(',');
  console.log("revertSortFunc", a, b, aValue, bValue);

  if (order === 'desc') {
    return aValue.localeCompare(bValue);
  } else {
    return bValue.localeCompare(aValue);
  }
};

class UsersTable extends React.Component {
     onAfterSaveCell = (row, cellName, cellValue) => {
        console.log("onAfterSaveCell", row, cellName, cellValue);
        this.props.onUpdateRow(row);
    }

    render() {
        return (
          <BootstrapTable
            data = { this.props.users }
            selectRow={ {
                mode: 'radio',
                hideSelectColumn: false,
                bgColor: 'lightgray',
                clickToSelect: true
            } }
            tableBodyClass="table-striped"
            cellEdit={ {
                mode: 'click',
                blurToSave: true,
                afterSaveCell: this.onAfterSaveCell  // a hook for after saving cell
            } }
            options={ {
                onDeleteRow: this.props.onDeleteRow,
                onAddRow: this.props.onAddRow,
                defaultSortName: 'name',
                defaultSortOrder: 'asc'
            } }
            insertRow deleteRow search pagination
            >

            <TableHeaderColumn dataField='userId' isKey dataSort>Användarid</TableHeaderColumn>
            <TableHeaderColumn dataField='name'
                dataSort
            >Namn</TableHeaderColumn>
            <TableHeaderColumn dataField='roles'
                dataSort
                dataFormat={rolesFormatter}
                sortFunc={ rolesSortFunc }
                customInsertEditor={{ getElement: createRolesEditor }}
                customEditor={{ getElement: createRolesEditor }}>
                Roller
            </TableHeaderColumn>
          </BootstrapTable>
        );
    }
}

class AllUsers extends Component{
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
            this.notify(updatedUser.name + " updated");
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
            }
            this.notify("Failed to delete " + rows[0] + ": " + results.statusText, Constants.notification.ERROR)
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

export default class UserLayout extends Component{
    render(){
        return (
            <Switch>
              <Route exact path='/user' component={AllUsers}/>
            </Switch>
        )
    }
}
