import React from 'react';
class Currency extends React.Component {

    async componentDidMount() {
        const currenciesResponse = await fetch(`${process.env.REACT_APP_MSGNC_TRAVEL_BACKEND_HOST}/api/currencies`);
        const currenciesJson = await currenciesResponse.json();
        this.props.getCurrencies(currenciesJson);
    }


    populateCurrencies = (currencies) => {
        return currencies.map((currency) => this.populateCurrency(currency));
    }

    populateCurrency = (currency) => {
        return <option
            key={currency.name}
            value={JSON.stringify(currency)}>
            {currency.symbol}
        </option>
    }

    render() {
        let currencyId = `currency-${this.props.id}`,
            optionItems = this.populateCurrencies(this.props.currencies);

        return <div>
            <label htmlFor={currencyId}>currency</label>
            <select
                name={currencyId}
                data-id={this.props.id}
                id={currencyId}
                className="currency">
                {optionItems}
            </select>
        </div>
    }
}

export default Currency;