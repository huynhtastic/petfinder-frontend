import fetch from 'node-fetch';
import { Select } from 'antd';
import React, { Component } from 'react';
import env from '../../env';

const Option = Select.Option;

export default class Find extends Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {
        animal: [],
        breed: [],
        size: {},
        sex: {},
        age: [],
      },
      selected: {
        animal: '',
        breed: '',
        size: '',
        sex: '',
        location: '',
        age: '',
      },
    };
  }

  makeDropdowns() {

  }

  convertParams(json) {
    // convert the params in json to valid key/value pairs for the pet api's
    // query params
    var params = {};
    for (var jsonKey in json) {
      if (json.hasOwnProperty(jsonKey)) {
        var jsonValue = json[jsonKey];
        params[jsonKey] = {};
        if (jsonValue.constructor === Array) {
          // if it's an array, it means we just make the key a capitalized
          // version of the value
          params[jsonKey] = jsonValue.reduce((paramVal, itm) => {
            var paramKey = itm.charAt(0).toUpperCase() + itm.slice(1);
            paramVal[paramKey] = itm;

            return paramVal;
          }, {});
        } else if (Object.prototype.toString.call(jsonValue) === '[object Object]') {
          // it's an object, so we just assign that to params
          // we trust i actually capitalized correctly on the backend
          params[jsonKey] = jsonValue;;
        } else {
          console.log('found unexpected param:', jsonValue);
        }
      }
    }
    console.log('converted params:', params);
    this.setState({params: params});
    console.log(this.state);
  }

  componentDidMount() {
    // fetch the search options to choose from
    fetch(`${env.apiUrl}/getFindParams`)
      .then((res) => {
        if (res.status === 404) {
          alert("Error getting search parameters");
        } else {
          return res.json();
        }
      })
      .then((json) => {
        if (json) {
          console.log(json);
          this.convertParams(json);
        }
      });
  }

  render() {
    return (
      <div>
        {this.makeDropdowns()}
      </div>
    )
  }
}
