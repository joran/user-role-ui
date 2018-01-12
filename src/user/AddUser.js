import React, { Component } from 'react';

export default class AddUser extends Component{
    constructor(props) {
        super(props);
        const { userId = "", name = "", roles = [] } = (this.props.user||{});
        this.state = {
            userId: userId,
            name: name,
            roles: roles
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        console.log("AddUser.constructor", this)
    };

    handleSubmit(event){
        event.preventDefault();
        this.props.onAddUser(this.state);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({ [name]: value });
    }

//    handleInputChange(event) {
//        const target = event.target;
//        const value = target.type === 'checkbox' ? target.checked : target.value;
//        const name = target.name;
//        this.setState({ [name]: value });
//    }

    render(){
        console.log("AddUser.render", this.props, this.state);
        const { userId, name, roles } = this.state;
        return (
            <div className="add container">
                <h1 className="page-header">Ny Användare</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="well">
                        <div className="form-group">
                            <label>Användarnamn</label>
                            <input type="text" className="form-control" placeholder="Användarnamn vid inloggning" name="userId" value={userId} onChange={this.handleInputChange}/>
                        </div>
                        <div className="form-group">
                            <label>Namn</label>
                            <input type="text" className="form-control" placeholder="För- och efternamn" name="name" value={name}  onChange={this.handleInputChange}/>
                        </div>
                        <div className="form-group">
                            <label>Roller</label>
                            <input type="text" className="form-control" placeholder="Roller" value={roles} disabled="true"/>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Spara</button>
                </form>
            </div>
        )
    }
}