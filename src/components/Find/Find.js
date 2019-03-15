import fetch from 'node-fetch';
import { Select, Input } from 'antd';
import React, { Component } from 'react';
import env from '../../env';

const Option = Select.Option;

export default class Find extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {},
      types: {},
      validParams: {},
    };
  }

  onSelect = (value, option) => {
    this.setState(prevState => ({
      selected: {
        ...prevState.selected,
        [option.props.selectkey]: value
      }
    }));
    console.log(this.state);
  }

  //onTextInputChange = (event) => {


  async componentDidMount() {
    // fetch the types to populate pet search parameters
    try {
      const res = await fetch(`${env.apiUrl}/getTypes`)
      if (res.status === 404) {
        alert('Error getting search parameters.');
      } else {
        const json = await res.json();
        if (json) {
          // It's a valid object, so we set it to state
          console.log('compdidmount json', json);
          this.setState(json);
        } else {
          alert('Empty search parameters.');
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  makeDropdowns() {
    // create dropdowns by populating options then the select component
    const types = this.state.types;
    const validParams = this.state.validParams;
    let formControls = [];

    for (let [validParamName, paramDetails] of Object.entries(validParams)) {
      const controlType = paramDetails[1];
      if (controlType === 'text') {
        const controlAttrs = paramDetails[0];
        // TODO: assign an onChange function
        formControls.push(<Input key={validParamName} {...controlAttrs}  />);
      } else if (controlType === 'select') {
        const optionValues = paramDetails[0];
        let options = [];
        if (!!optionValues.length) {
          // The array isn't empty so we make options
          for (let value of optionValues) {
            options.push(
              <Option key={value}
                selectkey={validParamName}
                value={value}>
                {value}
              </Option>);
          }
        }
        const loading = options.length > 0 ? false : true;
        formControls.push(
          <Select key={validParamName}
            defaultValue='---'
            loading={loading}
            onSelect={this.onSelect} >
            {options}
          </Select>);
      }
    }
    return formControls;

    // get the category of parameter
      //    let selects = [];
      //    for (let [animal, animalParams] of Object.entries(types)) {
      //      if (types.hasOwnProperty(animal)) {
      //        for (let [animalParam, paramValues] of Object.entries(animalParams)) {
      //          if (animalParam !== '_links') {
      //            // valid search param, so we create Options
      //            let options = [];
      //            for (let value of paramValues) {
      //              options.push(
      //                <Option key={value}
      //                  selectkey={animalParam}
      //                  value={value}>
      //                  {value}
      //                </Option>);
      //            }
      //            const loading = options.length > 0 ? false : true;
      //            selects.push(
      //              <Select key={animalParam}
      //                defaultValue='---'
      //                loading={loading}
      //                onSelect={this.onSelect} >
      //                {options}
      //              </Select>);
      //          }
      //        }
      //        // finished options now need to wrap Select and render
      //        // show that it's loading if the parameters haven't been populated
      //      }
      //    }
      //    return selects;
      //    // TODO: create dropdown for breed.list
  }

  render() {
    return (
      <div>
        <form>
          {this.makeDropdowns()}
        </form>
      </div>
    )
  }
}
