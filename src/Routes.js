import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './components/Home/Home';
import Results from './components/Results/Results';

export default () =>
  <Switch>
    <Route path='/' exact component={Home} />
    <Route path='/getSearchResults' exact component={Results} />
  </Switch>;
