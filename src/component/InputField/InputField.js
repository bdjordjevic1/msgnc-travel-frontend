import React from 'react';

class InputField extends React.Component {

    render() {
        const { id, type, name, value, handleChange } = this.props;
        let uniqueID = id ? `${name}-${id}` : name;

        return <div>
            <label htmlFor={uniqueID}>{name}</label>
            <input
                type={type}
                name={uniqueID}
                data-id={id}
                id={uniqueID}
                value={value}
                onChange={handleChange}
                className={name}
            />
        </div>
    }
}

export default InputField;