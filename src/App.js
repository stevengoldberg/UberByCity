import React, { Component } from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import {  Provider } from 'react-redux';
import * as reducers from 'reducers';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import 'bootstrap-webpack';
import { Controls } from './components/';
import 'style!./styles/main.scss';
import * as config from 'config';

const logger = config.debug ? createLogger({collapsed: true}) : () => {};
const reducersApp = combineReducers(reducers);
const createStoreWithMiddleware = applyMiddleware(logger, thunkMiddleware)(createStore);
const store = createStoreWithMiddleware(reducersApp);

export default class App extends Component {
  render() {
    return (
        <Provider store={ store }>
          <Controls />
        </Provider>
    );
  }
}
