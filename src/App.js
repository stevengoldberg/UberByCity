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
import { appActionTypes } from 'constants/app-actions';

const logger = createLogger({
  collapsed: true,
  predicate: (getState, action) => config.debug && (action.type !== appActionTypes.TIMER_TICK)
});
const reducersApp = combineReducers(reducers);
const createStoreWithMiddleware = applyMiddleware(thunkMiddleware, logger)(createStore);
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
