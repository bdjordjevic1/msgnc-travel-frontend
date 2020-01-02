import React from 'react';

class Currency extends React.Component {

    async componentDidMount() {
        let currenciesResponse = await fetch(`${process.env.REACT_APP_MSGNC_TRAVEL_BACKEND_HOST}/api/currencies`);
        let currenciesJson = await currenciesResponse.json();
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

            const {labelName, labelClassName, className, name} = this.props;

        return <div>
            <label className={labelClassName} htmlFor={currencyId}>{labelName}</label>
            <select
                name={name}
                data-id={this.props.id}
                id={currencyId}
                onChange={this.props.handleChange}
                className={className}>
                {optionItems}
            </select>
        </div>
    }
}

export default Currency;