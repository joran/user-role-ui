import React, { Component } from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import RolesEditor from './RolesEditor'

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


export default class UsersTable extends Component {
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
