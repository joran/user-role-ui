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
            <button
              className='btn btn-info btn-xs textarea-save-btn'
              onClick={ this.updateData }>
              save
            </button>
          </div>
        );
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

        //this.setState({roles:this.currentRoles, allroles:this.state.allroles});
//        if (this.state.roles.indexOf(role) < 0) {
//          this.setState({ roles: this.state.roles.concat([ role ]) });
//        } else {
//          this.setState({ roles: this.state.roles.filter(r => r !== role) });
//        }
    }

    _hasRole(role) {
//        return this.props.row.roles.map(r => r.id).indexOf(role.id) > -1;
        return this.state.roles.map(r => r.id).indexOf(role.id) > -1;
    }
}

class NameEditor extends React.Component {
  constructor(props) {
    super(props);
    this.updateData = this.updateData.bind(this);
    this.state = {
      name: props.defaultValue,
      open: true
    };
  }
  focus() {
    this.refs.inputRef.focus();
  }
  updateData() {
    this.props.onUpdate(this.state.name);
  }
  close = () => {
    this.setState({ open: false });
    this.props.onUpdate(this.props.defaultValue);
  }
  render() {
    const fadeIn = this.state.open ? 'in' : '';
    const display = this.state.open ? 'block' : 'none';
    return (
      <div className={ `modal fade ${fadeIn}` } id='myModal' role='dialog' style={ { display } }>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-body'>
              <input
                ref='inputRef'
                className={ ( this.props.editorClass || '') + ' form-control editor edit-text' }
                style={ { display: 'inline', width: '50%' } }
                type='text'
                value={ this.state.name }
                onChange={ e => { this.setState({ name: e.currentTarget.value }); } } />
            </div>
            <div className='modal-footer'>
              <button type='button' className='btn btn-primary' onClick={ this.updateData }>Save</button>
              <button type='button' className='btn btn-default' onClick={ this.close }>Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const createRolesEditor = (onUpdate, props) => (<RolesEditor onUpdate={ onUpdate } {...props}/>);
const createNameEditor = (onUpdate, props) => (<NameEditor onUpdate={ onUpdate } {...props}/>);

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
                mode: 'click'
            } }
            options={ {
                onDeleteRow: this.props.onDeleteRow,
                onAddRow: this.props.onAddRow,
                defaultSortName: 'name',  // default sort column name
                defaultSortOrder: 'asc'  // default sort order
            } }
            insertRow deleteRow search pagination
            >

            <TableHeaderColumn dataField='userId' isKey dataSort>Användarid</TableHeaderColumn>
            <TableHeaderColumn dataField='name'
                dataSort
                customEditor={{ getElement: createNameEditor }}
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
                console.log("onDeleteRow", rows[0]);
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

export default class UserLayout extends Component{
    render(){
        return (
            <Switch>
              <Route exact path='/user' component={AllUsers}/>
            </Switch>
        )
    }
}
