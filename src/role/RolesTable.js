import React, { Component } from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

export default class RolesTable extends Component {
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
