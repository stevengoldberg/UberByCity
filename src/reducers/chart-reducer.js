import _ from 'underscore';
import createReducer from '../utils/create-reducer';
import * as config from 'config';
import assign from 'object-assign';
import { appActionTypes } from '../constants/app-actions';
import { cityActionTypes } from '../constants/city-actions';

const initialState = {
    displayProduct: config.productList[0],
    compare: 'estimates/price',
    cities: config.initialLocations,
    graphData: [],
    cityError: false,
    erroredCities: [],
    refreshTime: new Date().toLocaleTimeString(),
    countdown: 60,
};

export function chart(state = initialState, action = {}) {
    return createReducer(state, action, {
        [appActionTypes.NEW_DATA_REQUESTED](state, action) {
            const { data: { reset, compare } } = action;
            let newGraphData;
            let newCountdown;

            if(reset === 'graph') {
                newGraphData = [];
            } else {
                newGraphData = state.graphData;
            }

            return {
                ...state,
                graphData: newGraphData,
                loading: true,
                countdown: initialState.countdown,
                compare,
            };
        },

        [appActionTypes.UBER_DATA_SUCCEEDED](state, action) {
            const { data: { city, times = null, prices = null } } = action;
            let newGraphData;
            let newCities = [];
            let newErroredCities;
            let oldIndex;

            newErroredCities = _.without(state.erroredCities, city);

            if(state.cities.indexOf(city) === -1) {
                newCities = [].concat(city, state.cities);
            } else {
                newCities = state.cities;
            }

            /*
             * On receiving data, add it to the graphData array if it's a newly added city
             * or replace the previous entry in the array for that city if it already existed
             */

            oldIndex = state.graphData.indexOf(_.findWhere(state.graphData, {city}));
            
            if (oldIndex > -1) {

                newGraphData = state.graphData;

                if(times !== null) {
                    newGraphData[oldIndex] = {
                        city,
                        data: {
                            type: 'time',
                            data: times,
                        },
                    };
                } else {
                    newGraphData[oldIndex] = {
                        city,
                        data: {
                            type: 'prices',
                            data: prices,
                        },
                    };
                }
            } else {
                if(times !== null) {
                    newGraphData = [
                        ...state.graphData,
                        {
                            city,
                            data: {
                                type: 'time',
                                data: times,
                            },
                        },
                    ];
                } else {
                    newGraphData = [
                        ...state.graphData,
                        {
                            city,
                            data: {
                                type: 'prices',
                                data: prices,
                            },
                        },
                    ];
                }
            }

            return {
                ...state,
                cityError: false,
                graphData: newGraphData,
                cities: newCities,
                erroredCities: newErroredCities,
            };
        },

        [cityActionTypes.CITY_REMOVED](state, action) {
            const { data: city } = action;

            const newCities = _.without(state.cities, city);
            const newGraphData = _.without(state.graphData, _.findWhere(state.graphData, {city: city}));

            return {
                ...state,
                graphData: newGraphData,
                cities: newCities,
            };
        },

        [cityActionTypes.CITY_ADDED](state, action) {
            const { data: city} = action;

            const newCities = [].concat(state.cities, city);

            return {
                ...state,
                cities: newCities,
            };
        },

        [appActionTypes.ALL_DATA_LOADED](state, action) {
            return {
                ...state,
                loading: false,
                refreshTime: new Date().toLocaleTimeString(),
            };
        },

        [appActionTypes.TIMER_TICK](state, action) {
            const newTime = state.countdown - 1;

            return {
                ...state,
                countdown: newTime,
            };
        },

        [appActionTypes.COMPARISON_CHANGED](state, action) {
            const { compare } = action;
            return {
                ...state,
                compare,
                graphData: [],
            };
        },

        [appActionTypes.PRODUCT_CHANGED](state, action) {
            const { data: displayProduct } = action;
            return {
                ...state,
                displayProduct,
            };
        },

        [appActionTypes.UBER_DATA_FAILED](state, action) {
            const { error: { message: erroredCity } } = action;
            let newErroredCities = state.erroredCities;
            
            if (erroredCity) {
                newErroredCities = [].concat(state.erroredCities, erroredCity);
            }

            return {
                ...state,
                erroredCities: newErroredCities,
                cityError: true,
                loading: false,
            };
        },
    });
}