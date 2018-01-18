import React, {Component} from 'react';
import {Table, Button, ButtonToolbar} from 'react-bootstrap';

export default class Users extends Component {
    render() {
        console.log("Users.render", this.props, this.state);

        let cls = {};
        const asc = this.state.sortOrderAsc;
        cls[fieldName] = asc ? "sorted-asc" : "sorted-desc";

        const fieldName = this.state.sortByFieldName;
        const filterValue = this.state.filterValue;
        const users = this.sortBy(fieldName, this.filter(filterValue, this.props.users));

        return (
            <div>
                <div>
                    <div className={"pull-right"}>
                        <input type="text" onChange={this.handleFilterChange}/>
                    </div>
                    <ButtonToolbar>
                        <Button onClick={this.props.onCreateUser} bsSize="xsmall" >Ny Användare</Button>
                    </ButtonToolbar>
                </div>
                <br/>
                <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                        <th className={cls["userId"]} onClick={() => this.handleSortByField("userId")}>Användarid</th>
                        <th className={cls["name"]} onClick={() => this.handleSortByField("name")}>Namn</th>
                        <th className={cls["roles"]} onClick={() => this.handleSortByField("roles")}>Roller</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(u =>
                        <tr key={u.userId}>
                            <td>{u.userId}</td>
                            <td>{u.name}</td>
                            <td>{this.rolesDataFormatter(u.roles)}</td>
                            <td>
                                <div className="pull-right">
                                    <ButtonToolbar>
                                        <Button bsStyle="primary" bsSize="xsmall" onClick={() => this.props.onEditUser(u)}>Redigera</Button>
                                        <Button bsStyle="danger" bsSize="xsmall" onClick={() => this.props.onDeleteUser(u)}>Ta bort</Button>
                                    </ButtonToolbar>
                                </div>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </Table>
                <ButtonToolbar>
                    <Button onClick={this.props.onCreateUser} bsSize="xsmall" >Ny Användare</Button>
                </ButtonToolbar>
            </div>
        )
    }

    constructor(props) {
        super(props);

        this.state = {
            sortByFieldName: 'userId',
            sortOrderAsc: true,
            filterValue:""

        }
        this.handleFilterChange = this.handleFilterChange.bind(this);
        console.log("Users.constructor", this)
    };

    handleFilterChange(event){
        const value = event.target.value.trim();
        if(value !== this.state.filterValue ){
            this.setState({filterValue: value});
        }
    }
    handleSortByField(fieldName){
        this.setState({
            sortByFieldName:fieldName,
            sortOrderAsc: fieldName === this.state.sortByFieldName ? !this.state.sortOrderAsc : true
        });
    }

    filter(filterValue, users){
        if (filterValue === ""){
            return users;
        }
        return users
            .filter(u => [u.userId, u.name, this.rolesDataFormatter(u.roles)]
                .join(" ")
                .toLocaleLowerCase()
                .indexOf(filterValue.toLocaleLowerCase()) > -1);
    }
    sortBy(fieldName, users){
        return users.sort((a,b) => {
            const order = this.state.sortOrderAsc ? 1 : -1;
            if(fieldName === "roles"){
                const valueA = this.rolesDataFormatter(a.roles).toLocaleLowerCase();
                const valueB = this.rolesDataFormatter(b.roles).toLocaleLowerCase();
                return order * valueA.localeCompare(valueB)
            }
            const valueA = (a[fieldName]||"").toLocaleLowerCase();
            const valueB = (b[fieldName]||"").toLocaleLowerCase();
            return order * valueA.localeCompare(valueB)
        })
    }
    rolesDataFormatter(roles) {
        return (roles || []).map(r => r.rolename).join(', ')
    }
}
