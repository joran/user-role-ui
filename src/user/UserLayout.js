import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

const UserLayout = () => (
    <Switch>
      <Route exact path='/user' component={AllUsers}/>
    </Switch>
 )

class AllUsers extends Component{
    constructor(props) {
        super(props);
        this.users = [];
        this.state = { data: this.users};
    }

    componentDidMount(){
        fetch("/api/user")
        .then(results => {
            return results.json();
        }).then(data => {
            this.users = data;
            this.setState({data:this.users});
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
        }).then(data => {
            console.log("onAddRow", row, data);
            this.users.push(data);
            this.setState({
              data: this.users
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
                this.users = this.users.filter((user) => {
                  return user.userId !== rows[0];
                });

                this.setState({
                  data: this.users
                });
            }
        })

    }

    render() {
        return(
            <UsersTable users={this.state.data}
                onAddRow={ this.onAddRow }
                onDeleteRow={ this.onDeleteRow }
            />
        )
    }
}



class UsersTable extends React.Component {
    render() {
        const cellEditProp = {
          mode: 'click'
        };
        const selectRow = {
            mode: 'radio',
            hideSelectColumn: false,
            bgColor: 'lightgray',
            clickToSelect: true
        };
        return (
          <BootstrapTable
            data = { this.props.users }
            selectRow={ selectRow }
            remote={ this._remote }
            tableBodyClass="table-striped"
            insertRow deleteRow search pagination
            cellEdit={ cellEditProp }
            options={ {
                onCellEdit: this.props.onCellEdit,
                onDeleteRow: this.props.onDeleteRow,
                onAddRow: this.props.onAddRow,
                defaultSortName: 'name',  // default sort column name
                defaultSortOrder: 'asc'  // default sort order

            } }>

            <TableHeaderColumn dataField='userId' isKey dataSort>Användarid</TableHeaderColumn>
            <TableHeaderColumn dataField='name' dataSort>Namn</TableHeaderColumn>
            <TableHeaderColumn dataField='roles'
                dataSort
                dataFormat={rolesFormatter}
                sortFunc={ rolesSortFunc }
                customInsertEditor={{ getElement: createRolesEditor }}>
                Roller
            </TableHeaderColumn>
          </BootstrapTable>
        );
    }

    _remote(remoteObj) {
        // Only cell editing, insert and delete row will be handled by remote store
        remoteObj.cellEdit = true;
        remoteObj.insertRow = true;
        remoteObj.dropRow = true;
        return remoteObj;
    }
}

class RolesEditor extends Component {
    constructor(props) {
        console.log("RolesEditor:consructor")
        super(props);
        this._onToggleRole = this._onToggleRole.bind(this);
        this.allroles = [];
        this.currentRoles = [];
        this.state = {allroles: this.allroles, roles: this.currentRoles };
    }

    componentDidMount(){
        fetch("/api/role")
        .then(results => {
            return results.json();
        }).then(data => {
            this.allroles = data;
            this.setState({allroles:this.allroles, roles:this.currentRoles});
        })
    }

    getFieldValue(){
        return this.state.roles;
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
          <div ref='inputRef'>
            { roleCheckBoxes }
          </div>
        );
    }

    _onToggleRole(event) {
        const roleId = event.currentTarget.name;
        const role = this.state.allroles.find(r => r.id === roleId);
        if (this.state.roles.indexOf(role) < 0) {
          this.setState({ roles: this.state.roles.concat([ role ]) });
        } else {
          this.setState({ roles: this.state.roles.filter(r => r !== role) });
        }
    }

    _hasRole(role) {
        const rids = this.state.roles.map(r => r.id);
        console.log("hasRole", this.state.roles, rids, rids.indexOf(role.id));
        return this.state.roles.map(r => r.id).indexOf(role.id) > -1;
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

export default UserLayout;

