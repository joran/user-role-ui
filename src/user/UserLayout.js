import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';


class RolesEditor extends Component {
    constructor(props) {
        console.log("RolesEditor:consructor", props)
        super(props);
        this.updateData = this.updateData.bind(this);
        this._onToggleRole = this._onToggleRole.bind(this);
        this.state = {allroles: [], roles: props.defaultValue||[]   };
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

    _onToggleRole(event) {
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
        const roleCheckBoxes = this.state.allroles.map(role => (
          <div key={ `span-${role.id}` }>
            <input
              type='checkbox'
              key={ role.id }
              name={ role.id }
              checked={ this._hasRole(role) }
              onKeyDown={ this.props.onKeyDown }
              onChange={ this._onToggleRole } />
            <label key={ `label-${role}` } htmlFor={ role.id }> { role.rolename } </label>
          </div>
        ));

        return (
          <div ref='inputRef' onBlur={this.handleBlur}>
            { roleCheckBoxes }
          <button type='button' className='btn btn-primary btn-xs' onClick={ this.updateData }>Save</button>
          <button type='button' className='btn btn-default btn-xs' onClick={ this.close }>Close</button>
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
        this.state = { data: []};
    }

    componentDidMount(){
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
            return results.json();
        }).then(updatedUser => {
            console.log("onUpdateRow", row, updatedUser, this.state.users);
            let users = this.state.users.filter(u => {
                return u.userId !== updatedUser.userId;
             });

            this.setState({
              users: users.concat([updatedUser])
            });
        })
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
        })

    }

    render() {
        return(
            <UsersTable users={this.state.users}
                onAddRow = { this.onAddRow }
                onDeleteRow = { this.onDeleteRow }
                onUpdateRow = { this.onUpdateRow }
            />
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
