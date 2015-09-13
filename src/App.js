import React, { Component } from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import {  Provider } from 'react-redux';
import Main from './Main';
import * as reducers from 'reducers';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';

import { Router, Route } from 'react-router';
import BrowserHistory from 'react-router/lib/BrowserHistory';

import { chart } from './components/';

const reducersApp = combineReducers(reducers);
const createStoreWithMiddleware = applyMiddleware(logger, thunkMiddleware)(createStore);
const store = createStoreWithMiddleware(reducersApp);
const history = new BrowserHistory();

export default class App extends Component {
  render() {
    return (
        <Provider store={ store }>
          {() =>
            <Router history={history}>
              <Route path="/" component={Main}>
                <Route path="chart" component={chart}></Route>
              </Route>
            </Router>
          }
        </Provider>
    );
  }
}
