import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './components/Home/Home';
import Results from './components/Results/Results';
import Map from './components/Map/Map';

export default () =>
  <Switch>
    <Route path='/' exact component={Home} />
    <Route path='/getSearchResults' exact component={Results} />
    <Route path='/favorites' exact component={Results} />
    <Route path='/map' exact component={Map} />
  </Switch>;
