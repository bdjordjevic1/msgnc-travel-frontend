import React from 'react';

class Location extends React.Component {

    async componentDidMount() {
        let locationResponse = await fetch(`${process.env.REACT_APP_MSGNC_TRAVEL_BACKEND_HOST}/api/locations`);
        let locationJson = await locationResponse.json();
        this.props.getLocations(locationJson);
    }

    populateLocations = (locations) => {
        console.log(locations);
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

        return <div>
            <label htmlFor={this.props.id}>Country of travel</label>
            <select
                name={this.props.id}
                data-id={this.props.id}
                id={this.props.id}
                className="location"
                onChange={this.props.handleChange}>
                {optionItems}
            </select>
        </div>
    }
}

export default Location