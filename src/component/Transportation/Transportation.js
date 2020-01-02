import React from 'react';

class Transportation extends React.Component {

    async componentDidMount() {
        let transportationResponse = await fetch(`${process.env.REACT_APP_MSGNC_TRAVEL_BACKEND_HOST}/api/transportations`);
        let transportationJson = await transportationResponse.json();
        this.props.getTransportations(transportationJson);
    }

    populateTransportations = (transportations) => {
        return transportations.map((transportation) => this.populateTransportation(transportation));
    }

    populateTransportation = (transportation) => {
        return (<option
            key={transportation}
            value={transportation}>
            {transportation}
        </option>)
    }

    render() {
        let optionItems = this.populateTransportations(this.props.transportations);
        const {labelName, labelClassName, className} = this.props;

        return <>
            <label className={labelClassName} htmlFor={this.props.id}>{labelName}</label>
            <select
                className={className}
                name={this.props.id}
                data-id={this.props.id}
                id={this.props.id}
                onChange={this.props.handleChange}>
                <option
                    key="DEFAULT"
                    value="null">
                    Choose transportation
                </option>
                {optionItems}
            </select>
        </>
    }
}

export default Transportation;