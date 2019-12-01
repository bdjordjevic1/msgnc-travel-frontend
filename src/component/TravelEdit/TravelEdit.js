import React, { Component } from 'react';
import DatePicker from 'react-datepicker'
import Meal from '../Meal/Meal';
import Currency from '../Currency/Currency';
import InputField from '../InputField/InputField';
import Location from '../Location/Location';
import Transportation from '../Transportation/Transportation';

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
                    BREAKFAST: 0,
                    LUNCH: 0,
                    DINNER: 0
                },
                dailyRate: 0
            }
        },
        currencies: [],
        locations: [],
        transportations: []
    }

    handleChange = (e) => {
        const { name, value, className } = e.target;
        //TODO: Remove this default method call
        if (["price", "description", "currency"].includes(className)) {
            let { travelReport } = this.state;

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
        } 
        // else {
        //     this.setState(prevState => ({
        //         travelReport: {
        //             ...prevState.travelReport,
        //             [name]: value
        //         }
        //     }))
        // }
    }

    handleTransportationChange = (e) => {
        let { value } = e.target;

        this.setState(prevState => ({
            travelReport: {
                ...prevState.travelReport,
                transportationType: value
            }
        }))
    }

    handleLocationChange = (e) => {
        let { value } = e.target;

        this.setState(prevState => ({
            travelReport: {
                ...prevState.travelReport,
                locationTo: JSON.parse(value)
            }
        }))
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

    addNumberOfMeals = (event) => {
        let numberOfMeals = event.target.value;
        let mealType = event.target.name.toUpperCase();
        this.setState(prevState => ({
            travelReport: {
                ...prevState.travelReport,
                dailyRateCalculation: {
                    ...prevState.travelReport.dailyRateCalculation,
                    meals: {
                        ...prevState.travelReport.dailyRateCalculation.meals,
                        [mealType]: Number(numberOfMeals)
                    }
                }
            }
        }))
    }

    handleSubmit = (e) => {
        e.preventDefault();
        var travelReport = this.state;

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
        updatedExpenses.push({ price: "", description: "" });
        travelReport.additionalExpense.expenses = updatedExpenses;

        this.setState({ travelReport: travelReport });
    }

    render() {
        let { travelReport } = this.state;

        return (
            <div className="travelData">
                <form onSubmit={this.handleSubmit} onChange={this.handleChange}>

                    <div className="travelOrder">
                        <DatePicker
                            selected={travelReport.dailyRateCalculation.travelPeriod.end}
                            onChange={(date) => this.handleDateChange(date, "dateOfSubmission")}
                            dateFormat="MMMM d, yyyy"
                        />
                        <InputField
                            type="text"
                            name="firstName"
                            value={travelReport.firstName}
                        />
                        <InputField
                            type="text"
                            name="lastName"
                            value={travelReport.lastName}
                        />

                        <Transportation
                            id='transportationType'
                            transportations={this.state.transportations}
                            getTransportations={(transportations) => this.setState({ transportations: transportations })}
                            handleChange={this.handleTransportationChange}
                        />

                        <Location
                            id='locationTo'
                            locations={this.state.locations}
                            getLocations={(locations) => this.setState({ locations: locations })}
                            handleChange={this.handleLocationChange}
                        />

                        <button onClick={this.addExpense}>Add expense</button>
                        {
                            travelReport.additionalExpense.expenses.map((val, idx) => {

                                return (
                                    <div key={idx}>
                                        <p>{`Expense #${idx + 1}`}</p>

                                        <InputField
                                            type="text"
                                            name="price"
                                            id={idx}
                                            value={travelReport.additionalExpense.expenses[idx].price}
                                        />

                                        <Currency
                                            id={idx}
                                            currencies={this.state.currencies}
                                            getCurrencies={(currencies) => this.setState({ currencies: currencies })}
                                        />

                                        <InputField
                                            type="text"
                                            name="description"
                                            id={idx}
                                            value={travelReport.additionalExpense.expenses[idx].description}
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
                        <Meal meal="breakfast"
                            addNumberOfMeals={this.addNumberOfMeals}
                            value={travelReport.dailyRateCalculation.meals.BREAKFAST} />
                        <Meal meal="lunch"
                            addNumberOfMeals={this.addNumberOfMeals}
                            value={travelReport.dailyRateCalculation.meals.LUNCH} />
                        <Meal meal="dinner"
                            addNumberOfMeals={this.addNumberOfMeals}
                            value={travelReport.dailyRateCalculation.meals.DINNER} />
                    </div>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}

export default TravelEdit