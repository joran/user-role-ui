import React, { Component } from 'react';
import { Table } from 'react-bootstrap';

class MyTableCell extends Component{
    constructor(props){
        super(props);
        console.log("MyTableCell.constructor", this)
        this.dataFormatter = this.props.dataFormatter || this.dataFormatter;
    }

    dataFormatter({ data, dataField }){
        console.log("MyTableCell.dataFormatter", data, dataField);
//        if(this.props.dataFormatter){~
//            return this.props.dataFormatter(data, dataField)
//        }
        return data[dataField].toString();
    }

    render(){
        console.log("MyTableCell.render", this.props)
        return (<td>{this.dataFormatter(this.props)}</td>)
    }

}

export class MyTableHeader extends Component{
    constructor(props){
        super(props);
        this.headerValue = this.props.children;
        console.log("MyTableHeader.constructor", this)
    }

    componentDidMount(){
        console.log("MyTableHeader.componentDidMount", this.headerValue, this.props)
    }

    render() {
        return (
            <th>{this.headerValue}</th>
        )
    }
}

export default class MyTable extends Component{
    constructor(props) {
        console.log("MyTable.constructor", props)
        super(props);
        this.keyFieldName = this.props.children
            .map(child => child.props)
            .find(column => column.isKey)
            .dataField;
    };

    renderBodyRow(rowData, keyFieldName, columns){
        console.log("renderBodyRow", rowData, keyFieldName, columns)
        const rowKey = rowData[keyFieldName];
        const cols = columns.map(column =>
                <MyTableCell key={rowKey+column.props.dataField} data={rowData} keyFieldName={keyFieldName} {...column.props} />
        )
        return (
            <tr key={rowKey}>
                {cols}
            </tr>
        )
    }

    render(){
        console.log("MyTable.render", this.props);
        let bodyRows = this.props.data.map(d => this.renderBodyRow(d, this.keyFieldName, this.props.children));

        let headerRow = (
            <tr>
                {this.props.children}
            </tr>
        )
        return (
            <Table striped bordered hover responsive>
                 <thead>
                    { headerRow }
                </thead>
                <tbody>
                    { bodyRows }
                </tbody>
            </Table>
        )
    }
}