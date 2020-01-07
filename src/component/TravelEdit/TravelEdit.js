import React, { Component } from 'react';
import DatePicker from 'react-datepicker'
import Meal from '../Meal/Meal';
import InputField from '../InputField/InputField';
import Location from '../Location/Location';
import Transportation from '../Transportation/Transportation';
import Expense from '../Expense/Expense'
import Cookies from 'js-cookie';

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
        travelOrder: {
            dateOfSubmission: new Date(),
            includedExpenses: "",
            purposeOfTravel: ""
        },
        currencies: [],
        locations: [],
        transportations: []
    }

    async componentDidMount() {
        let csrfDTOResponse = await fetch(`${process.env.REACT_APP_MSGNC_TRAVEL_BACKEND_HOST}/api/csrf/token`, {
                credentials: 'include',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                })});
        let csrfDTO = await csrfDTOResponse.json();
        Cookies.set('X-CSRF-TOKEN', csrfDTO.csrfToken)
    }

    handleExpensesChange = (e) => {
        const { value, name } = e.target;
        if (["price", "description", "currency"].includes(name)) {
            let { travelReport } = this.state;

            travelReport.additionalExpense.expenses[e.target.dataset.id][name] =
                (name === "currency") ? JSON.parse(value) : value;

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
    }

    handleNameChange = (e) => {
        let { value, name } = e.target;

        this.setState(prevState => ({
            travelReport: {
                ...prevState.travelReport,
                [name]: value
            }
        }))
    }

    handleOrderNameChange = (e) => {
        let { value, name } = e.target;

        this.setState(prevState => ({
            travelOrder: {
                ...prevState.travelOrder,
                [name]: value
            }
        }))
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

    handleOrderDateChange = (date, name) => {
        this.setState(prevState => ({
            travelOrder: {
                ...prevState.travelOrder,
                [name]: date
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
        console.log(Cookies.get('JSESSIONID'))

        fetch(`${process.env.REACT_APP_MSGNC_TRAVEL_BACKEND_HOST}/api/reports/generate`, {
            method: 'POST',
            body: JSON.stringify(travelReport),
            credentials: 'include',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': Cookies.get('X-CSRF-TOKEN')
            })
        })
        .then(response => response.json())
        .then(data => {
            window.open(`${process.env.REACT_APP_MSGNC_TRAVEL_BACKEND_HOST}/api/reports/show?filePath=${data.path}`);
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
        let { travelReport, travelOrder, currencies } = this.state;

        return (
            <div className="travelData">
                <form onSubmit={this.handleSubmit}>

                    <div className="travelOrder">
                    <h1>Travel Order</h1>
                        <div>
                            <label className="form-control-lg" htmlFor="orderDateOfSubmission">Date of submission</label>
                            <DatePicker
                                className="form-control-lg"
                                id="orderDateOfSubmission"
                                selected={travelOrder.dateOfSubmission}
                                onChange={(date) => this.handleOrderDateChange(date, "dateOfSubmission")}
                                dateFormat="MMMM d, yyyy"
                                value={travelOrder.dateOfSubmission}
                            />
                        </div>

                        <InputField
                            className="form-control-lg d-inline"
                            labelClassName="form-control-lg"
                            type="text"
                            name="includedExpenses"
                            labelName="Included expenses"
                            value={travelOrder.includedExpenses}
                            handleChange={this.handleOrderNameChange}
                        />

                        <InputField
                            className="form-control-lg d-inline"
                            labelClassName="form-control-lg"
                            type="text"
                            name="purposeOfTravel"
                            labelName="Purpose of travel"
                            value={travelOrder.purposeOfTravel}
                            handleChange={this.handleOrderNameChange}
                        />
                    </div>

                    <div className="travelReport">
                        <h1>Travel Order</h1>

                        <label className="form-control-lg" htmlFor="reportDateOfSubmission">Date of submission</label>
                        <DatePicker
                            className="form-control-lg"
                            id="reportDateOfSubmission"
                            selected={travelReport.dateOfSubmission}
                            onChange={(date) => this.handleDateChange(date, "dateOfSubmission")}
                            dateFormat="MMMM d, yyyy"
                            value={travelReport.dateOfSubmission}
                        />
                        <InputField
                            className="form-control-lg d-inline"
                            labelClassName="form-control-lg"
                            labelName="First name"
                            type="text"
                            name="firstName"
                            value={travelReport.firstName}
                            handleChange={this.handleNameChange}
                        />
                        <InputField
                            className="form-control-lg d-inline"
                            labelClassName="form-control-lg"
                            labelName="Last name"
                            type="text"
                            name="lastName"
                            value={travelReport.lastName}
                            handleChange={this.handleNameChange}
                        />

                        <Transportation
                            className="form-control-lg d-inline"
                            labelClassName="form-control-lg"
                            labelName="Type of transportation"
                            id='transportationType'
                            transportations={this.state.transportations}
                            getTransportations={(transportations) => this.setState({ transportations: transportations })}
                            handleChange={this.handleTransportationChange}
                        />

                        <Location
                            className="form-control-lg d-inline"
                            labelClassName="form-control-lg"
                            labelName="Country of travel"
                            id='locationTo'
                            locations={this.state.locations}
                            getLocations={(locations) => this.setState({ locations: locations })}
                            handleChange={this.handleLocationChange}
                        />

                        <Expense
                            expenses={travelReport.additionalExpense.expenses}
                            currencies={currencies}
                            getCurrencies={(currencies) => this.setState({ currencies: currencies })}
                            addExpense={this.addExpense}
                            handleChange={this.handleExpensesChange}
                        />

                        <div>
                        <label className="form-control-lg" htmlFor="travelPeriodStart">Departure day</label>
                            <DatePicker
                                className="form-control-lg"  
                                id="travelPeriodStart"
                                selected={travelReport.dailyRateCalculation.travelPeriod.start}
                                onChange={(date) => this.handleDateChange(date, "start")}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="MMMM d, yyyy h:mm aa"
                                timeCaption="time"
                                value={travelReport.dailyRateCalculation.travelPeriod.start}
                            />
                        </div>

                        <div>
                            <label className="form-control-lg" htmlFor="travelPeriodEnd">Arrival day</label>
                            <DatePicker
                                className="form-control-lg"
                                id="travelPeriodEnd"
                                selected={travelReport.dailyRateCalculation.travelPeriod.end}
                                onChange={(date) => this.handleDateChange(date, "end")}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="MMMM d, yyyy h:mm aa"
                                timeCaption="time"
                                value={travelReport.dailyRateCalculation.travelPeriod.end}
                            />
                        </div>
                        <Meal meal="breakfast"
                            className="form-control-lg d-inline"
                            labelClassName="form-control-lg"
                            labelName="Number of breakfasts"
                            addNumberOfMeals={this.addNumberOfMeals}
                            value={travelReport.dailyRateCalculation.meals.BREAKFAST} />
                        <Meal meal="lunch"
                            className="form-control-lg d-inline"
                            labelClassName="form-control-lg"
                            labelName="Number of lunches"
                            addNumberOfMeals={this.addNumberOfMeals}
                            value={travelReport.dailyRateCalculation.meals.LUNCH} />
                        <Meal meal="dinner"
                            className="form-control-lg d-inline"
                            labelClassName="form-control-lg"
                            labelName="Number of dinners"
                            addNumberOfMeals={this.addNumberOfMeals}
                            value={travelReport.dailyRateCalculation.meals.DINNER} />
                    </div>
                    <input className="btn btn-primary" type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}

export default TravelEdit