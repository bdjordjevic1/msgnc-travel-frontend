import React from 'react';

class InputField extends React.Component {

    render() {
        const { id, type, name, value, handleChange, className, labelName, labelClassName } = this.props;
        let uniqueID = id ? `${name}-${id}` : name;

        return <div>
            <label className={labelClassName} htmlFor={uniqueID}>{labelName}</label>
            <input
                type={type}
                name={uniqueID}
                data-id={id}
                id={uniqueID}
                value={value}
                onChange={handleChange}
                className={className}
            />
        </div>
    }
}

export default InputField;