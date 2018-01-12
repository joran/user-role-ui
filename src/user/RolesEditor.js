import React, { Component } from 'react';

export default class RolesEditor extends Component {
    constructor(props) {
        console.log("RolesEditor:consructor", props)
        super(props);

        this.onChange = this.onChange.bind(this);
        this.state = {allroles: [], roles: props.defaultValue||[]};
    }

    componentDidMount(){
        console.log("RolesEditor:componentDidMount")
        fetch("/api/role")
        .then(results => {
            return results.json();
        }).then(data => {
            this.setState({allroles:data, roles:this.state.roles});
        })
    }

    getFieldValue(){
        return this.state.roles;
    }

    updateData() {
        this.props.onUpdate(this.state.roles);
    }

    close = () => {
        this.setState({ open: false });
        this.props.onUpdate(this.props.defaultValue||[]);
    }

    onBlur(event) {
        console.log("handleBlur", event);
    }
    onChange(event) {
        const roleId = event.currentTarget.name;
        const role = this.state.allroles.find(r => r.id === roleId);
        let currentRoles = this.state.roles;

        if (currentRoles.indexOf(role) < 0) {
            currentRoles = currentRoles.concat([ role ]);
        } else {
            currentRoles = currentRoles.filter(r => r !== role);
        }
        this.setState({roles:currentRoles, allroles:this.state.allroles});
    }

    _hasRole(role) {
        return this.state.roles.map(r => r.id).indexOf(role.id) > -1;
    }
    render() {
        console.log("RolesEditor:render")
        let buttons;
        if(this.props.defaultValue){
            buttons = (
              <div>
                  <button type='button' className='btn btn-primary btn-xs' onClick={ this.updateData }>Save</button>
                  <button type='button' className='btn btn-default btn-xs' onClick={ this.close }>Close</button>
              </div>
            )
        }
        const roleCheckBoxes = this.state.allroles.map(role => (
          <div key={ `span-${role.id}` }>
            <input
              type='checkbox'
              key={ role.id }
              name={ role.id }
              checked={ this._hasRole(role) }
              onKeyDown={ this.props.onKeyDown }
              onChange={ this.onChange } />
            <label key={ `label-${role}` } htmlFor={ role.id }> { role.rolename } </label>
          </div>
        ));

        return (
          <div ref='inputRef' tabIndex="0" onBlur={this.onBlur}>
            { roleCheckBoxes }
            { buttons }
          </div>
        );
    }

}
