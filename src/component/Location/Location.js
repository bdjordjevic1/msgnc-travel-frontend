import React from 'react';

class Location extends React.Component {

    async componentDidMount() {
        let locationResponse = await fetch(`${process.env.REACT_APP_MSGNC_TRAVEL_BACKEND_HOST}/api/locations`);
        let locationJson = await locationResponse.json();
        this.props.getLocations(locationJson);
    }

    populateLocations = (locations) => {
        return locations.map((location) => this.populateLocation(location));
    }

    populateLocation = (location) => {
        return <option
            key={location.isoCode}
            value={JSON.stringify(location)}>
            {location.country}
        </option>
    }

    render() {
        let optionItems = this.populateLocations(this.props.locations);
        const {labelName, labelClassName, className} = this.props;

        return <div>
            <label className={labelClassName} htmlFor={this.props.id}>{labelName}</label>
            <select
                name={this.props.id}
                data-id={this.props.id}
                id={this.props.id}
                className={className}
                onChange={this.props.handleChange}>
                {optionItems}
            </select>
        </div>
    }
}

export default Location