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
      options: {},
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
          this.setState(this.populateStaticOptions(json));
        } else {
          alert('Empty search parameters.');
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Take in fetched JSON and populate the options from the getTypes call. These
   * options are only for options that are hardcoded from the backend.
   *
   * @param {object} json - Fetched from getTypes call.
   *
   * @returns {object} - JSON with static options defined in json.options.
   */
  populateStaticOptions(json) {
    const validParams = json.validParams;
    let finalOptions = {};  // The object to add to json and return

    for (let [validParamName, paramDetails] of Object.entries(validParams)) {
      const controlType = paramDetails[1];
      if (controlType === 'select') {
        let optionValues = paramDetails[0];
        // Create options if there are options to make
        let paramOptions = [];
        if (validParamName === 'type') {
          optionValues = Object.keys(json.types);
        }
        for (let value of optionValues) {
          paramOptions.push(
            <Option key={value}
              selectkey={validParamName}
              value={value}>
              {value}
            </Option>);
        }
        finalOptions[validParamName] = paramOptions;
      }
    }
    json.options = finalOptions;
    console.log('popOptions', json);
    return json;
  }

  /**
   * Create form controls to filter pet searches. First creates form controls
   * then populates them with choices when applicable.
   *
   * @returns {array} formControls - Controls to help filter pet searches.
   */
  createControlForms() {
    const validParams = this.state.validParams;
    let formControls = [];

    // TODO: Create form labels
    for (let [validParamName, paramDetails] of Object.entries(validParams)) {
      // See what type of control we're dealing with
      const controlType = paramDetails[1];
      if (controlType === 'text') {
        // Create an input contrl
        const controlAttrs = paramDetails[0];
        // TODO: assign an onChange function
        formControls.push(<Input key={validParamName} {...controlAttrs}  />);
      } else if (controlType === 'select') {
        // Create a dropdown control
        let loading = true;
        let defaultValueText = 'Please select a Type of Animal.';
        if (!!this.state.options[validParamName].length) {
          // We just change some cosmetic values
          loading = false;
          defaultValueText = '---';
        }
        formControls.push(
          <Select key={validParamName}
            defaultValue={defaultValueText}
            loading={loading}
            onSelect={this.onSelect} >
            {this.state.options[validParamName]}
          </Select>);
      }
    }
    return formControls;
  }

  render() {
    return (
      <div>
        <form>
          {this.createControlForms()}
        </form>
      </div>
    )
  }
}
