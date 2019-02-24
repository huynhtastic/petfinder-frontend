import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Home from './components/Home/Home';

export default () =>
  <Switch>
    <Route path='/' exact component={Home} />
  </Switch>;
