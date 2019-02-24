import { Menu } from 'antd';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Routes from './Routes'
import logo from './logo.svg';
import './App.css';
import '../node_modules/antd/dist/antd.css';

class App extends Component {
  render() {
    return (
      <div className="App container">
        <Menu mode='horizontal'>
          <Menu.Item key='mail'>
            <Link to='/'>Home</Link>
          </Menu.Item>
        </Menu>
        <Routes />
      </div>
    );
  }
}

export default App;
