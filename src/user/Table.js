import React, { Component } from 'react';
import { Table } from 'react-bootstrap';

class MyTableCell extends Component{
    constructor(props){
        super(props);
        this.dataFormatter = this.props.dataFormatter || this.dataFormatter;
        console.log("MyTableCell.constructor", this)
    }

    dataFormatter(data){
        return data[this.props.dataField].toString();
    }

    render(){
        console.log("MyTableCell.render", this.props)
        return (<td>{this.dataFormatter(this.props.data)}</td>)
    }

}

export class MyTableHeader extends Component{
    constructor(props){
        super(props);
        this.headerValue = this.props.children;
        this.dataFormatter = this.props.dataFormatter || this.dataFormatter;
        this.handleOnClick = (this.props.handleOnClick || this.handleOnClick).bind(this);
        this.compare = (this.props.compare || this.compare).bind(this);
        console.log("MyTableHeader.constructor", this)
    }

    dataFormatter(rowData){
        return rowData[this.props.dataField].toString();
    }

    handleOnClick (event){
        console.log("MyTableHeader.handleOnClick");
        const { dataSort, dataField, sortingInfo } = this.props;
        if (dataSort){
            sortingInfo.onDataSort(dataField, this.compare);
        }
    }

    compare(thiz, other){
        console.log("MyTableHeader.compare", thiz, other, this);

        const thizValue = this.dataFormatter(thiz).toLocaleLowerCase();
        const otherValue = this.dataFormatter(other).toLocaleLowerCase();

        return thizValue.localeCompare(otherValue);
    }

    renderDataSort({isSortedAsc}){
        if (isSortedAsc){
            return (<span className={"glyphicon glyphicon-chevron-up"} aria-hidden={true}></span>);
        }
        return (<span className={"glyphicon glyphicon-chevron-down"} aria-hidden={true}></span>);
    }

    dataSortIndicator(){
        if (this.props.sortingInfo.sortedBy !== this.props.dataField) {
            return;
        }
        return this.renderDataSort(this.props.sortingInfo);
    }

    render() {
        return (
            <th onClick={this.handleOnClick}>{this.headerValue} {this.dataSortIndicator()}</th>
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
        this.state = {
            sortingInfo:{
                isSortedAsc:true,
                compareFunction:(a,b)=>0,
                sortedBy:undefined,
                onDataSort:this.onDataSort.bind(this)}};
    };

    reverseCompare(compareFunction){
        return (a,b) =>  0 - compareFunction(a,b);
    }
    onDataSort(sortedBy, compareFunction){
        console.log("MyTable.onDataSort", this, sortedBy, this.state.sortingInfo);

        const sortingInfo = {
            ...this.state.sortingInfo,
            isSortedAsc:true,
            compareFunction:compareFunction,
            sortedBy:sortedBy
        };

        if (this.state.sortingInfo.sortedBy === sortedBy && this.state.sortingInfo.isSortedAsc){
            sortingInfo.compareFunction = this.reverseCompare(compareFunction);
            sortingInfo.isSortedAsc = false;
        }
        this.setState({sortingInfo:sortingInfo});
    }

    renderHeaderRow(child){
        return (<MyTableHeader key={"header_"+child.props.dataField}
                    data={this.props.data}
                    sortingInfo={this.state.sortingInfo}
                    {...child.props}/>)
    }

    renderBodyRow(rowData, keyFieldName, columns){
        console.log("renderBodyRow", rowData, keyFieldName, columns)
        const rowKey = rowData[keyFieldName];
        const cols = columns.map(column =>
                <MyTableCell key={rowKey+column.props.dataField}
                    data={rowData}
                    keyFieldName={keyFieldName}
                    {...column.props} />
        )
        return (
            <tr key={rowKey}>
                {cols}
            </tr>
        )
    }

    render(){
        console.log("MyTable.render", this.props, this.state);
        const data = this.props.data.sort(this.state.sortingInfo.compareFunction);
        let bodyRows = data.map(d => this.renderBodyRow(d, this.keyFieldName, this.props.children));
        let headerRow = (
            <tr>
                {this.props.children.map(child => this.renderHeaderRow(child))}
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