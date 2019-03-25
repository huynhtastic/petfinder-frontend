import { Marker, InfoWindow, Map, GoogleApiWrapper } from 'google-maps-react';
import fetch from 'node-fetch';
import Geocode from "react-geocode";
import React, { Component } from 'react';
import env from '../../env';

const mapStyles = {
    width: '80%',
    height: '80%'
};

Geocode.setApiKey(env.GMAPS_KEY);

export class MapContainer extends Component {
	constructor(props) {
    super(props);
    this.state = {
      results: [],
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
    };
  }

  async componentDidMount() {
    const url = `${env.apiUrl}/favorites`;
    const res = await fetch(url);
    const json = await res.json();
    console.log(json);

    for (let animal of json.animals) {
      let addrObj = animal.contact.address;
      for (let [key, val] of Object.entries(addrObj)) {
        if (val === null) {
          addrObj[key] = '';
        }
      }
      let address = `${addrObj.address1} ${addrObj.address2} ${addrObj.city} ${addrObj.state} ${addrObj.country} ${addrObj.postcode}`;
      try {
        const geoRes = await Geocode.fromAddress(address);
        animal.latlng = geoRes.results[0].geometry.location;
        //const { lat, lng } = geoRes.results[0].geometry.location;

        //console.log(lat, lng);
      } catch (err) {
        console.error(err);
      }
    }
    console.log(json.animals)
    this.setState({ results: json.animals });
  }

	onMarkerClick = (props, marker, e) => {
    console.log(marker.id);
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: { petid: -1 },
      });
    }
  };

  determineVisible(marker) {
    console.log(marker);
  };

  makeMarkers() {
    const markers = this.state.results.map(animal => (
      [<Marker
        onClick={this.onMarkerClick}
        petid={animal.id}
        name={animal.name}
        position={animal.latlng}
      />,
      <InfoWindow
        key={animal.name}
        marker={this.state.activeMarker}
        visible={animal.id === this.state.activeMarker.petid}
        onClose={this.onClose}
      >
        <div>
          <a href={animal.url}>{animal.name}</a>
          <h4>{`${animal.breeds.primary} | ${animal.age} | ${animal.gender}`}</h4>
          <img alt='animal-pic' src={animal.photos[0].small} />}
        </div>
      </InfoWindow>]
    ));
    return markers;
  }

  render() {
    if (this.state.results.length !== 0) {
      const start = this.state.results[0];
      const { lat, lng } = start.latlng;
      return (
        <Map
          google={this.props.google}
          zoom={14}
          style={mapStyles}
          initialCenter={{ lat: lat, lng: lng }}
        >
          {this.makeMarkers()}
        </Map>
      );
    }
    return null;
  }
}

export default GoogleApiWrapper({
  apiKey: env.GMAPS_KEY,
})(MapContainer);
