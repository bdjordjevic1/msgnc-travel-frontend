import React from 'react';

class InputField extends React.Component {

    render() {
        let uniqueID = `${this.props.name}-${this.props.id}`;

        return <div>
            <label htmlFor={uniqueID}>{this.props.name}</label>
            <input
                type={this.props.type}
                name={uniqueID}
                data-id={this.props.id}
                id={uniqueID}
                value={this.props.value}
                className={this.props.name}
            />
        </div>
    }
}

export default InputField;