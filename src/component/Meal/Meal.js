import React from 'react';

class Meal extends React.Component {

    render() {
        return <div><label htmlFor={this.props.meal}>{this.props.meal.toLowerCase()}</label>
                        <input
                        type="text"
                        name={this.props.meal}
                        data-id={this.props.meal}
                        id={this.props.meal}
                        value={this.props.value}
                        onChange={this.props.addNumberOfMeals} 
                        className={this.props.meal}
                        />
                </div>
    }
}

export default Meal;