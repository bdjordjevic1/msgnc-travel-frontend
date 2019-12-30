import React from 'react';
import Currency from '../Currency/Currency';
import InputField from '../InputField/InputField';

class Expense extends React.Component {

    render() {

            let expenses = this.props.expenses.map((val, idx) => {

                return (
                    <div key={idx}>
                        <p>{`Expense #${idx + 1}`}</p>

                        <InputField
                            type="text"
                            name="price"
                            id={idx}
                            value={this.props.expenses[idx].price}
                            handleChange={this.props.handleChange}
                        />

                        <Currency
                            id={idx}
                            currencies={this.props.currencies}
                            getCurrencies={this.props.getCurrencies}
                            handleChange={this.props.handleChange}
                        />

                        <InputField
                            type="text"
                            name="description"
                            id={idx}
                            value={this.props.expenses[idx].description}
                            handleChange={this.props.handleChange}
                        />
                    </div>
                )
            });

            return <div>
                <button onClick={this.props.addExpense}>Add expense</button>
                {expenses}
            </div>;
    
    }
}

export default Expense;