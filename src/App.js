import React, { Component } from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import {  Provider } from 'react-redux';
import * as reducers from 'reducers';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import 'bootstrap-webpack';

import { Router, Route } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import { Controls } from './components/';
import 'style!./styles/main.scss';

const logger = createLogger({collapsed: true});
const reducersApp = combineReducers(reducers);
const createStoreWithMiddleware = applyMiddleware(logger, thunkMiddleware)(createStore);
const store = createStoreWithMiddleware(reducersApp);
const history = new createBrowserHistory();

export default class App extends Component {
  render() {
    return (
        <Provider store={ store }>
          <Router history={history}>
            <Route path="/" component={Controls}>
            </Route>
          </Router>
        </Provider>
    );
  }
}
