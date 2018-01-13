import React, {Component} from 'react';
import {Table, Button, ButtonToolbar} from 'react-bootstrap';

export default class UsersTable extends Component {
    render() {
        console.log("UsersTable.render", this.props, this.state);
        const users = this.props.users;
        return (
            <Table striped bordered hover responsive>
                <thead>
                <tr>
                    <th>Användarid</th>
                    <th>Namn</th>
                    <th>Roller</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {users.map(u =>
                    <tr key={u.userId}>
                        <td>{u.userId}</td>
                        <td>{u.name}</td>
                        <td>{(u.roles || []).map(r => r.rolename).join(', ')}</td>
                        <td>
                            <div className="pull-right">
                                <ButtonToolbar>
                                    <Button bsStyle="primary" bsSize="xsmall" onClick={() => this.handleEdit(u)}>Redigera</Button>
                                    <Button bsStyle="danger" bsSize="xsmall" onClick={() => this.handleDelete(u)}>Ta bort</Button>
                                </ButtonToolbar>
                            </div>
                        </td>
                    </tr>
                )}
                </tbody>
            </Table>
        )
    }

    constructor(props) {
        super(props);
        this.handleEdit = this.props.onEditUser;
        this.handleDelete = this.props.onDeleteUser;
        console.log("UsersTable.constructor", this)
    };
}
