import _ from 'underscore';
import createReducer from '../utils/create-reducer';
import { initialLocations, productList } from '../config';
import assign from 'object-assign';
import { appActionTypes } from '../constants/app-actions';
import { cityActionTypes } from '../constants/city-actions';


const initialState = {
    displayProduct: 'uberBlack',
    compare: 'estimates/price',
    cities: initialLocations,
    graphData: [],
    cityError: false,
    refreshTime: new Date().toLocaleTimeString(),
};

export function chart(state = initialState, action = {}) {
    return createReducer(state, action, {
        [appActionTypes.NEW_DATA_REQUESTED](state, action) {
            const { data: { reset, compare } } = action;
            let newGraphData;

            if(reset) {
                newGraphData = [];
            } else {
                newGraphData = state.graphData;
            }

            return {
                ...state,
                graphData: newGraphData,
                loading: true,
                compare,
            };
        },

        [appActionTypes.UBER_DATA_SUCCEEDED](state, action) {
            const { data: { city, times = null, prices = null } } = action;
            let newGraphData;
            let newCities;

            if(state.cities.indexOf(city) === -1) {
                newCities = [].concat(city, state.cities);
            } else {
                newCities = state.cities;
            }

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

            return {
                ...state,
                cityError: false,
                graphData: newGraphData,
                cities: newCities,
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

        [appActionTypes.UBER_DATA_FAILED](state, action) {
            return {
                ...state,
                cityError: true,
                loading: false,
            };
        },

        [appActionTypes.ALL_DATA_LOADED](state, action) {
            return {
                ...state,
                loading: false,
                refreshTime: new Date().toLocaleTimeString(),
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
    });
}