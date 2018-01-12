import React, { Component } from 'react';
import { Table, Button, ButtonToolbar } from 'react-bootstrap';
import { Link } from 'react-router-dom'

export default class UsersTable extends Component{
    constructor(props) {
        super(props);
        console.log("UsersTable.constructor", this)
    };


    render(){
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
                    { users.map(d =>
                        <tr key={d.userId}>
                            <td>{d.userId}</td>
                            <td>{d.name}</td>
                            <td>{(d.roles || []).map(r => r.rolename).join(', ')}</td>
                            <td>
                                <div class="pull-right">
                                    <ButtonToolbar>
                                        <Link class="btn btn-primary btn-xs" to={`/user/edit/${d.userId}`}>Redigera</Link>
                                        <Button bsStyle="danger" bsSize="xsmall">Ta bort</Button>
                                    </ButtonToolbar>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        )
    }
}