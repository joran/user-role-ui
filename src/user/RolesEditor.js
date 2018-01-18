import React, { Component } from 'react';

export default class RolesEditor extends Component {
    constructor(props) {
        console.log("RolesEditor:consructor", props)
        super(props);

        this.onChange = this.onChange.bind(this);
        this.state = {selectedRoles: props.selectedRoles||[]};
    }

    getFieldValue(){
        return this.state.selectedRoles;
    }

    updateData() {
        this.props.onUpdate(this.state.selectedRoles);
    }

    close = () => {
        this.setState({ open: false });
        this.props.onUpdate(this.props.selectedRoles||[]);
    }

    onChange(event) {
        const roleId = event.currentTarget.name;
        const role = this.props.selectableRoles.find(r => r.id === roleId);
        let selectedRoles = this.props.selectedRoles;

        if (selectedRoles.indexOf(role) < 0) {
            selectedRoles = selectedRoles.concat([ role ]);
        } else {
            selectedRoles = selectedRoles.filter(r => r !== role);
        }
        // this.setState({currentRoles:currentRoles});
        this.props.onUpdate(selectedRoles);
    }

    _hasRole(role) {
        return this.props.selectedRoles
            .filter(r => r.id === role.id).length > 0;
    }
    render() {
        console.log("RolesEditor:render", this.props, this.state)
        const roleCheckBoxes = this.props.selectableRoles
            .sort((a,b) => a.rolename.localeCompare(b.rolename))
            .map(role => (
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
          </div>
        );
    }

}
