import React, { Component } from 'react';

export default class AddUser extends Component{
    render(){
        console.log("AddUser.render", this.props, this.state);
        const { userId, name, roles } = this.state;
        return (
            <div className="add container">
                <form onSubmit={this.handleSubmit}>
                    <div className="well">
                        <div className="form-group">
                            <label>Användarnamn</label>
                            <input type="text"
                                   disabled={!this.userIdEditable}
                                   className="form-control"
                                   placeholder="Användarnamn vid inloggning"
                                   name="userId"
                                   value={userId}
                                   pattern="[a-z][a-z0-9]{2,9}"
                                   maxLength={10}
                                   minLength={3}
                                   required
                                   onInvalid={(e) => e.target.setCustomValidity('Användarnamn måste innehålla 3-10 bokstäver eller siffror ([a-z][a-z0-9]{2,9})')}
                                   onInput={(e) => e.target.setCustomValidity('')}
                                   onChange={this.handleInputChange}/>
                        </div>
                        <div className="form-group">
                            <label>Namn</label>
                            <input type="text"
                                   className="form-control"
                                   placeholder="För- och efternamn"
                                   name="name"
                                   value={name}
                                   maxLength={20}
                                   minLength={3}
                                   required
                                   onInvalid={(e) => e.target.setCustomValidity('Namn måste innehålla 3-20 Tecken')}
                                   onInput={(e) => e.target.setCustomValidity('')}
                                   onChange={this.handleInputChange}/>
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
    constructor(props) {
        super(props);
        const { userId = "", name = "", roles = [] } = (this.props.user||{});
        this.userIdEditable = (this.props.userIdEditable !== false);
        this.state = {
            userId: userId,
            name: name,
            roles: roles
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        console.log("AddUser.constructor", this)
    };
    componentDidMount(){
        this._notificationSystem = this.refs.notificationSystem;
    }

    handleSubmit(event){
        event.preventDefault();
        this.props.onSubmit(this.state);
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

}
