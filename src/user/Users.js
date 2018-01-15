import React, {Component} from 'react';
import {Table, Button, ButtonToolbar} from 'react-bootstrap';

export default class Users extends Component {
    render() {
        console.log("Users.render", this.props, this.state);

        const fieldName = this.state.sortByFieldName;
        const asc = this.state.sortOrderAsc;

        let cls = {};
        cls[fieldName] = asc ? "sorted-asc" : "sorted-desc";

        const users = this.sortBy(fieldName, this.props.users);
        return (
            <div>
                <ButtonToolbar>
                    <Button onClick={this.props.onCreateUser} bsSize="xsmall" >Ny Användare</Button>
                </ButtonToolbar>
                <br/>
                <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                        <th className={cls["userId"]} onClick={() => this.onSortBy("userId")}>Användarid</th>
                        <th className={cls["name"]} onClick={() => this.onSortBy("name")}>Namn</th>
                        <th className={cls["roles"]} onClick={() => this.onSortBy("roles")}>Roller</th>
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
            sortOrderAsc: true

        }
        console.log("Users.constructor", this)
    };

    onSortBy(fieldName){
        this.setState({
            sortByFieldName:fieldName,
            sortOrderAsc: fieldName === this.state.sortByFieldName ? !this.state.sortOrderAsc : true
        });
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
