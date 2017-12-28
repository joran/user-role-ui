//import React, { Component } from 'react';
//import logo from './logo.svg';
//import './App.css';
//import { Navbar, Jumbotron, Button } from 'react-bootstrap';
//
//class App extends Component {
//  render() {
//    return (
//      <div className="App">
//        <header className="App-header">
//          <img src={logo} className="App-logo" alt="logo" />
//          <h1 className="App-title">Welcome to React</h1>
//        </header>
//        <p className="App-intro">
//          To get started, edit <code>src/App.js</code> and save to reload.
//        </p>
//      </div>
//    );
//  }
//}
//
//export default App;

import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

class RolesTable extends React.Component {
     onAfterSaveCell = (row, cellName, cellValue) => {
        console.log("onAfterSaveCell", row, cellName, cellValue);
        this.props.onUpdateRow(row);
    }
    render() {
        return (
          <BootstrapTable
            data = { this.props.roles }
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
                defaultSortName: 'rolename',
                defaultSortOrder: 'asc'
            } }
            insertRow deleteRow search pagination
            >

            <TableHeaderColumn dataField='id' isKey hiddenOnInsert hidden={ true }>id</TableHeaderColumn>
            <TableHeaderColumn dataField='rolename' dataSort>Roll</TableHeaderColumn>
            <TableHeaderColumn dataField='description' dataSort>Beskrivning</TableHeaderColumn>
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

class AllRoles extends Component{
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

export default class RoleLayout extends Component{
    render(){
        return (
               <Switch>
                 <Route exact path='/role' component={AllRoles}/>
               </Switch>
        )
    }
}

