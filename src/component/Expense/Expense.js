import React from 'react';
import Currency from '../Currency/Currency';
import InputField from '../InputField/InputField';

class Expense extends React.Component {

    render() {

            let expenses = this.props.expenses.map((val, idx) => {

                return (
                    <div key={idx}>
                        <h2>{`Expense #${idx + 1}`}</h2>

                        <InputField
                            className="form-control-lg d-inline"
                            labelClassName="form-control-lg"
                            labelName="Price"
                            type="text"
                            name="price"
                            id={idx}
                            value={this.props.expenses[idx].price}
                            handleChange={this.props.handleChange}
                        />

                        <Currency
                            className="form-control-lg d-inline"
                            labelClassName="form-control-lg"
                            labelName="Currency"
                            name="currency"
                            id={idx}
                            currencies={this.props.currencies}
                            getCurrencies={this.props.getCurrencies}
                            handleChange={this.props.handleChange}
                        />

                        <InputField
                            className="form-control-lg d-inline"
                            labelClassName="form-control-lg"
                            labelName="Description"
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
                <button className="btn btn-secondary" onClick={this.props.addExpense}>Add expense</button>
                {expenses}
            </div>;
    
    }
}

export default Expense;