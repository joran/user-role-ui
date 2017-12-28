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

const RoleLayout = () => (
    <Switch>
      <Route exact path='/role' component={AllRoles}/>
    </Switch>
 )

class AllRoles extends Component{
    constructor(props) {
        super(props);
        this.roles = [];
        this.state = { data: this.roles};
    }

    componentDidMount(){
        fetch("/api/role")
        .then(results => {
            return results.json();
        }).then(data => {
            this.roles = data;
            this.setState({data:this.roles});
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
        }).then(data => {
            console.log("onAddRow", row, data);
            this.roles.push(data);
            this.setState({
              data: this.roles
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
                this.roles = this.roles.filter((role) => {
                  return role.id !== rows[0];
                });

                this.setState({
                  data: this.roles
                });
            }
        })
    }

    render() {
        return(
            <RolesTable roles={this.state.data}
                onAddRow={ this.onAddRow }
                onDeleteRow={ this.onDeleteRow }
            />
        )
    }
}



class RolesTable extends React.Component {
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
            data = { this.props.roles }
            selectRow={ selectRow }
            remote={ this._remote }
            tableBodyClass="table-striped"
            insertRow deleteRow search pagination
            cellEdit={ cellEditProp }
            options={ {
                onCellEdit: this.props.onCellEdit,
                onDeleteRow: this.props.onDeleteRow,
                onAddRow: this.props.onAddRow,
                defaultSortName: 'rolename',  // default sort column name
                defaultSortOrder: 'asc'  // default sort order
            } }>

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

export default RoleLayout;

