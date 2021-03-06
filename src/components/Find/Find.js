import buildUrl from 'build-url';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import env from '../../env';

const Option = Select.Option;


class Find extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {},
      types: {},
      validParams: {},
      options: {},
      redirect: false,
    };
  }

  /**
   * Creates an option based on key, select key, value, and text given.
   *
   * @param {string} key - Key prop for object.
   * @param {string} selectkey - Selectkey prop to link object to a dropdown.
   * @param {object} optionals -
   *  {string} value={@param key} - Value prop to pass for Option.
   *  {string} text={@param key} - Key prop for text to show for this Option.
   *
   * @returns {Option} - Clickable option to pass to a Select.
   */
  generateOption(key, selectkey, {value=key, text=key} = {}) {
    return <Option key={key}
      selectkey={selectkey}
      value={value}>
      {text}
    </Option>;
  }

  /**
   * Changes state to reflect chosen values by user. If the user chooses a new
   * type of animal, change choices for each Select that is dependent on the
   * type of animal. If breeds choices is not present, fetch from backend and
   * cache the results if the user decides to click on a previously chosen type
   * of animal.
   *
   * @param {string} value - Value of option selected from a dropdown.
   * @param {Option} option - Option object of selected value from a dropdown.
   */
  onSelect = async (value, option) => {
    let newOptions = {};
    let ftchBreeds = undefined;
    if (option.props.selectkey === 'type') {
      if (!this.state.types[value]['breed']) {
        // We only need to fetch Breeds if it's not there
        try {
          const url = buildUrl(env.apiUrl, {
            path: 'getBreeds',
            queryParams: { type: value },
          });
          const res = await fetch(url);
          if (res.status === 404) { alert(`Error: breed fetch for ${value}.`); }
          // Grab the JSON and make the options
          // Also assign fetched breeds for caching
          const json = await res.json();
          console.log('breeds json', json);
          ftchBreeds = json.breeds.map(breedObj => breedObj.name);
          newOptions.breed= json.breeds.map(breedObj =>
            this.generateOption(breedObj.name, 'breed'));
        } catch (err) {
          console.log(err);
        }
      } else {
        newOptions.breed = this.state.types[value]['breed'];
      }
      for (let [srchParam, srchValues] of Object.entries(this.state.types[value])) {
        if (srchParam !== '_link') {
          newOptions[srchParam] = srchValues.map(val =>
            this.generateOption(val, srchParam));
        }
      }
    }
    console.log(newOptions);
    this.setState(prevState => {
      let newState = {
        types: prevState.types,
        selected: {
          ...prevState.selected,
          [option.props.selectkey]: value,
        },
        options: {
          ...prevState.options,
          ...newOptions,
        },
      };
      if (ftchBreeds !== undefined) newState.types[value]['breed'] = ftchBreeds;
      return newState;
    });
    console.log(this.state);
  }

  /**
   * Sets the state with each change on an input.
   *
   * @param {object} e - Fired event object for the changed input.
   */
  handleInputChange = (e) => {
    e.persist();
    this.setState(prevState => ({
      selected: {
        ...prevState.selected,
        [e.target.id]: e.target.value,
      },
    }));
  }

  /**
   * Handler for form submission that redirects a user to the results page with
   * a search url to send to the backend.
   *
   * @param {object} e - Fired event object for a submit button press.
   */
  handleSubmit = (e) => {
    e.preventDefault();
    console.log(e);
    const url = buildUrl('/', {
      path: 'getSearchResults',
      queryParams: this.state.selected,
    });
    this.setState({ redirect: url });
    console.log(url);
  }

  /**
   * Requests search parameters that a user can use to search for specific
   * animals before a full render is made. Sets the resulting JSON from the API
   * call to state.
   */
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
    const { getFieldDecorator } = this.props.form;
    const validParams = this.state.validParams;
    let formControls = [];

    for (let [validParamName, paramDetails] of Object.entries(validParams)) {
      // See what type of control we're dealing with
      const controlType = paramDetails[1];
      if (controlType === 'text') {
        // Create an input contrl
        const controlAttrs = paramDetails[0];
        formControls.push(
          <Input
            id={validParamName}
            key={validParamName}
            onChange={this.handleInputChange}
            {...controlAttrs}
          />
        );
      } else if (controlType === 'select') {
        // Create a dropdown control
        let loading = true;
        let defaultValueText = 'Please select a Type of Animal.';
        if (!!this.state.options[validParamName].length) {
          // We just change some cosmetic values
          loading = false;
          defaultValueText = '---';
        }

        const labelText = validParamName.charAt(0).toUpperCase() +
          validParamName.slice(1);
        formControls.push(
          <Col span={3} key={validParamName}>
            <Form.Item label={labelText}>
              {getFieldDecorator(validParamName)
              (
                <Select
                  placeholder={defaultValueText}
                  loading={loading}
                  onSelect={this.onSelect} >
                  {this.state.options[validParamName]}
                </Select>
              )}
            </Form.Item>
          </Col>);
      }
    }
    return formControls;
  }

  render() {
    const { redirect } = this.state;
    if (!!redirect) { return <Redirect to={redirect} />; }
    return (
      <Form layout="horizontal" onSubmit={this.handleSubmit}>
        <Row gutter={3}>
          {this.createControlForms()}
        </Row>
        <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
          <Button type='primary' htmlType='submit'>
            Find Pet!
          </Button>
        </Form.Item>
			</Form>
    )
  }
}

export default Form.create()(Find);
