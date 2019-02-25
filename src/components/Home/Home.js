import fetch from 'node-fetch';
import React, { Component } from 'react';
import './Home.css';
import env from '../../env.js';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
    }
  }

  componentDidMount() {
    fetch(`${env.apiUrl}/`)
      .then((res) => {
        if (res.status === 200) {
          console.log(res);
          return res.json();
        }
      })
      .then((json) => {
        console.log(json);
        //this.setState({message: json.message});
      })
  }

  render() {
    return (
      <div className='Home'>
        <div className='Lander'>
          <h1>Petfinder Search</h1>
          <p>A website to find your perfect pet!</p>
          <p>{this.state.message}</p>
        </div>
      </div>
    );
  }
}
