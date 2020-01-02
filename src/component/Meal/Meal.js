import React from 'react';

class Meal extends React.Component {

    render() {

        const {meal, value, addNumberOfMeals, labelName, labelClassName, className} = this.props;

        return <div>
                    <label className={labelClassName} htmlFor={meal}>{labelName}</label>
                    <input
                    className={className}
                    type="text"
                    name={meal}
                    data-id={meal}
                    id={meal}
                    value={value}
                    onChange={addNumberOfMeals} 
                    />
                </div>
    }
}

export default Meal;