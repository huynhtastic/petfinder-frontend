import fetch from 'node-fetch';
import { Select, Input } from 'antd';
import React, { Component } from 'react';
import env from '../../env';

const Option = Select.Option;

export default class Find extends Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {
        animal: {},
        breed: {},
        size: {},
        sex: {},
        age: {},
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

  onSelect = (value, option) => {
    console.log(option);
    this.setState(prevState => ({
      selected: {
        ...prevState.selected,
        [option.props.selectkey]: value
      }
    }));
    console.log(this.state);
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
    // TODO: create an option for ---: '' for blank choices for optional params
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

  makeDropdowns() {
    // create dropdowns by populating options then the select component
    var params = this.state.params;
    // get the category of parameter
    var selects = [];
    for (var paramKey in params) {
      if (params.hasOwnProperty(paramKey)) {
        // it's a valid category, so we start making Options
        var paramVal = params[paramKey];
        var options = [];
        for (var searchKey in paramVal) {
          if (paramVal.hasOwnProperty(searchKey)) {
            options.push(
              <Option key={searchKey}
                selectkey={paramKey}
                value={paramVal[searchKey]}>
                {searchKey}
              </Option>);
          }
        }
        // finished options now need to wrap Select and render
        // show that it's loading if the parameters haven't been populated
        var loading = options.length > 0 ? false : true;
        selects.push(
          <Select key={paramKey}
            defaultValue='---'
            loading={loading}
            onSelect={this.onSelect}
            optionLabelProp={paramKey}>
            {options}
          </Select>);
      }
    }
    return selects;
    // TODO: create dropdown for breed.list
  }

  render() {
    return (
      <div>
        <form>
          <Input placeholder='[Zip code] or [City, State]' allowClear />
          {this.makeDropdowns()}
        </form>
      </div>
    )
  }
}
