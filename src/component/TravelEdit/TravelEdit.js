import React, { Component } from 'react';
import DatePicker from 'react-datepicker'

import "react-datepicker/dist/react-datepicker.css";

class TravelEdit extends Component {
    
    state = {
        travelReport: {
            dateOfSubmission: new Date(),
            firstName: "",
            lastName: "",
            transportationType: "",
            locationTo: {
                country: "",
                isoCode: "",
                dailyRate: 0,
                currency: {
                    name: "",
                    isoCode: "",
                    symbol: ""
                },
                city: "",
            },
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
            },
            dailyRateCalculation: {
                travelPeriod: {
                    start: new Date(),
                    end: new Date()
                },
                meals: {
                    BREAKFAST: 1,
                    LUNCH: 2,
                    DINNER: 3
                },
                dailyRate: 0     
            }
        },
        currencies: [],
        locations: []
    }

    handleChange = (e) => {
        const {name, value, className} = e.target;

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
                    [name]: (className === "locationTo") ? JSON.parse(value) : value
                }
            }))
        }
    }

    handleDateChange = (date, id) => {
        if (id === "dateOfSubmission") {
            this.setState(prevState => ({
                travelReport: {
                    ...prevState.travelReport,
                    [id]: date
                }
            }))
        }
        this.setState(prevState => ({
            travelReport: {
                ...prevState.travelReport,
                dailyRateCalculation: {
                    ...prevState.travelReport.dailyRateCalculation,
                    travelPeriod: {
                       ...prevState.travelReport.dailyRateCalculation.travelPeriod,
                       [id]: date
                    }
                }
            }
        }))
    }
  
    handleSubmit = (e) => { 
        e.preventDefault();
        console.log(e.target)
        var travelReport = this.state;
        console.log(travelReport)
    
        fetch(`${process.env.REACT_APP_MSGNC_TRAVEL_BACKEND_HOST}/api/reports/generate`, {
            method: 'POST',
            body: JSON.stringify(travelReport),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }); 
    }  
  
    addExpense = (e) => {
        e.preventDefault()
        let { travelReport } = this.state;
        const updatedExpenses = travelReport.additionalExpense.expenses.slice();
        updatedExpenses.push({price:"", description:""});
        travelReport.additionalExpense.expenses = updatedExpenses;

        this.setState({ travelReport: travelReport });
    }

    async componentDidMount() {
        const currenciesResponse = await fetch(`${process.env.REACT_APP_MSGNC_TRAVEL_BACKEND_HOST}/api/currencies`);
        const currenciesJson = await currenciesResponse.json();
        this.setState({ currencies: currenciesJson });

        const locationResponse = await fetch(`${process.env.REACT_APP_MSGNC_TRAVEL_BACKEND_HOST}/api/locations`);
        const locationJson = await locationResponse.json();
        this.setState({ locations: locationJson });
      }

    render() {
        let { travelReport, currencies, locations } = this.state;

        let locationOptionItems = locations.map((location) =>
                                    <option
                                    key={location.isoCode}
                                    value={JSON.stringify(location)}>
                                        {location.country}
                                    </option>
                                );

        return (
            <div className="travelData">
                <form onSubmit={this.handleSubmit} onChange={this.handleChange}>

                    <div className="travelOrder">
                        <DatePicker
                            selected={travelReport.dailyRateCalculation.travelPeriod.end}
                            onChange={(date) => this.handleDateChange(date, "dateOfSubmission")}
                            dateFormat="MMMM d, yyyy"
                        />
                        <label htmlFor="firstName">Enter first name</label>
                        <input id="firstName" name="firstName" type="text" />

                        <label htmlFor="lastName">Enter last name</label>
                        <input id="lastName" name="lastName" type="text" />

                        <select name="transportationType" id="transportationType" className="transportationType">
                            <option key="default" value="default">
                                Choose transportation type
                            </option>
                            <option key="RENT_A_CAR" value="RENT_A_CAR">
                                Rent a car
                            </option>
                            <option key="PLANE" value="PLANE">
                                Plane
                            </option>
                            <option key="BUS" value="BUS">
                                Bus
                            </option>
                        </select>  

                        <label htmlFor="locationTo">Select country where you have been travelling to</label>
                        <select name="locationTo" id="locationTo" className="locationTo">
                            {locationOptionItems}
                        </select>        

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
                        
                        <DatePicker
                            selected={travelReport.dailyRateCalculation.travelPeriod.start}
                            onChange={(date) => this.handleDateChange(date, "start")}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="MMMM d, yyyy h:mm aa"
                            timeCaption="time"
                        />
                        <DatePicker
                            id="end"
                            selected={travelReport.dailyRateCalculation.travelPeriod.end}
                            onChange={(date) => this.handleDateChange(date, "end")}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="MMMM d, yyyy h:mm aa"
                            timeCaption="time"
                        />
                        <label htmlFor="breakfast">Breakfast</label>
                        <input
                        type="text"
                        name="breakfast"
                        data-id="breakfast"
                        id="breakfast"
                        value={travelReport.dailyRateCalculation.meals.BREAKFAST} 
                        className="breakfast"
                        />
                        <label htmlFor="breakfast">Lunch</label>
                        <input
                        type="text"
                        name="lunch"
                        data-id="lunch"
                        id="lunch"
                        value={travelReport.dailyRateCalculation.meals.LUNCH} 
                        className="lunch"
                        />
                        <label htmlFor="breakfast">Dinner</label>
                        <input
                        type="text"
                        name="dinner"
                        data-id="dinner"
                        id="dinner"
                        value={travelReport.dailyRateCalculation.meals.DINNER} 
                        className="dinner"
                        />
                    </div>
                <input type="submit" value="Submit" /> 
                </form>
            </div>
      );
    }
  }

export default TravelEdit