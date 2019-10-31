class Meals extends React.Component {

    render() {
        var mealUppercase = this.props.meal.toUppercase();

        return <div><label htmlFor={this.props.meal}>Breakfast</label>
                        <input
                        type="text"
                        name={this.props.meal}
                        data-id={this.props.meal}
                        id={this.props.meal}
                        value={this.props.value}
                        onChange={(e) => this.addNumberOfMeals(e)} 
                        className={this.props.meal}
                        />
                </div>
    }
}