import React, { Component } from 'react';

class TravelEdit extends Component {
    
    state = {
        travelReport: {
            firstName: "",
            lastName: "",
            additionalExpense: {
                expenses: [{
                    currency: {
                        name: "",
                        isoCode: "",
                        symbol: ""
                    },
                    price: "",
                    description: ""
                }]
            }
        },
        currencies: []
    }

    handleChange = (e) => {
        const {name, value, className} = e.target;

        console.log(name)
        console.log(value)
        console.log(className)

        if (["price", "description", "currency"].includes(className) ) {
            let {travelReport} = this.state;

            travelReport.additionalExpense.expenses[e.target.dataset.id][className] = 
                                                (className === "currency") ? JSON.parse(value) : value;

            const expenses = travelReport.additionalExpense.expenses;
       
            this.setState(prevState => ({
                travelReport: {
                    ...prevState.travelReport,
                    additionalExpense: {
                        ...prevState.travelReport.additionalExpense,
                        expenses: expenses
                    }
                }
            }))
        } else {
            this.setState(prevState => ({
                travelReport: {
                    ...prevState.travelReport,
                    [name]: value
                }
            }))
        }
      }
  
    handleSubmit = (e) => { 
        e.preventDefault();
        console.log(e.target)
        var travelReport = this.state;
    
        fetch('http://localhost:8080/api/reports/generate', {
            method: 'POST',
            body: JSON.stringify(travelReport),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }); 
    }  
  
    addExpense = (e) => {
        let { travelReport } = this.state;
        const updatedExpenses = travelReport.additionalExpense.expenses.slice();
        updatedExpenses.push({price:"", description:""});
        travelReport.additionalExpense.expenses = updatedExpenses;

        this.setState({ travelReport: travelReport });
    }

    async componentDidMount() {
        const response = await fetch(`http://localhost:8080/api/currencies`);
        const json = await response.json();
        this.setState({ currencies: json });
      }

    render() {
        let { travelReport, currencies } = this.state;
        return (
            <div className="travelData">
                <form onSubmit={this.handleSubmit} onChange={this.handleChange}>

                    <div className="travelOrder">
                        <label htmlFor="firstName">Enter first name</label>
                        <input id="firstName" name="firstName" type="text" />

                        <label htmlFor="lastName">Enter last name</label>
                        <input id="lastName" name="lastName" type="text" />

                        <button onClick={this.addExpense}>Add expense</button>
                        {
                            travelReport.additionalExpense.expenses.map((val, idx)=> {
                                let priceId = `price-${idx}`, 
                                    descriptionId = `description-${idx}`,
                                    currencyId = `currency-${idx}`;

                                let optionItems = currencies.map((currency) =>
                                    <option
                                    key={currency.name}
                                    value={JSON.stringify(currency)}>
                                        {currency.symbol}
                                    </option>
                                );

                                return (
                                <div key={idx}>
                                    <p>{`Expense #${idx + 1}`}</p>
                                    <label htmlFor={priceId}>Price</label>
                                    <input
                                    type="text"
                                    name={priceId}
                                    data-id={idx}
                                    id={priceId}
                                    value={travelReport.additionalExpense.expenses[idx].price} 
                                    className="price"
                                    />

                                    <select 
                                    name={currencyId} 
                                    data-id={idx} 
                                    id={currencyId} 
                                    className="currency">
                                        {optionItems}
                                    </select>

                                    <label htmlFor={descriptionId}>Description</label>
                                    <input
                                    type="text"
                                    name={descriptionId}
                                    data-id={idx}
                                    id={descriptionId}
                                    value={travelReport.additionalExpense.expenses[idx].description} 
                                    className="description"
                                    />
                                </div>
                                )
                            })
                        }
                    </div>
                <input type="submit" value="Submit" /> 
                </form>
            </div>
      );
    }
  }

export default TravelEdit