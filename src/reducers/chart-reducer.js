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
    citiesOnChart: [],
    refreshTime: new Date().toLocaleTimeString(),
    countdown: config.countdown,
};

export function chart(state = initialState, action = {}) {
    return createReducer(state, action, {
        [appActionTypes.NEW_DATA_REQUESTED](state, action) {
            const { data: { reset, compare } } = action;
            let newGraphData;
            let newCountdown;

            /*
             * When 'reset' is passed because e.g. the comparison has changed, start the graph with a clean slate.
             */

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
            const airportsForCity = _.findWhere(state.cities, {name: city.name}).airports;
            const currentAirport = airportsForCity[city.index];
            const multiAirport = airportsForCity.length > 1;

            newErroredCities = _.without(state.erroredCities, city);

            /*
             * If the city doesn't exist, add it to the list and initialize the airport index to 0.
             * If it is in the list, replace the old list item with the new one.
             */

            if(!_.findWhere(state.cities, {name: city.name})) {
                newCities = [].concat({name: city.name, index: 0, airports: airportsForCity}, state.cities);
            } else {
                newCities = [].concat(state.cities);
                const oldIndex = newCities.indexOf(_.findWhere(newCities, {name: city.name}));
                newCities[oldIndex] = {name: city.name, index: city.index, airports: airportsForCity};
            }

            /*
             * On receiving data, add it to the graphData array if it's a newly added city
             * or replace the previous entry in the array for that city if it already existed
             */

            oldIndex = state.graphData.indexOf(_.findWhere(state.graphData, {city: city.name}));
            
            if (oldIndex > -1) {

                newGraphData = state.graphData;

                if(times !== null) {
                    newGraphData[oldIndex] = {
                        city: city.name,
                        data: {
                            type: 'time',
                            data: times,
                            currentAirport,
                            multiAirport,
                        },
                    };
                } else {
                    newGraphData[oldIndex] = {
                        city: city.name,
                        data: {
                            type: 'prices',
                            data: prices,
                            currentAirport,
                            multiAirport,
                        },
                    };
                }
            } else {
                if(times !== null) {
                    newGraphData = [
                        ...state.graphData,
                        {
                            city: city.name,
                            data: {
                                type: 'time',
                                data: times,
                                currentAirport,
                                multiAirport,
                            },
                        },
                    ];
                } else {
                    newGraphData = [
                        ...state.graphData,
                        {
                            city: city.name,
                            data: {
                                type: 'prices',
                                data: prices,
                                currentAirport,
                                multiAirport,
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

        [appActionTypes.AIRPORTS_LOADED](state, action) {
            const { data: { city, airports } } = action;
            const cityIndex = state.cities.indexOf(_.findWhere(state.cities, {name: city}));
            let newCities = [].concat(state.cities);


            if (cityIndex > -1) {
                newCities[cityIndex] = {
                    name: city,
                    airports,
                    index: 0
                };
            } else {
                newCities = newCities.concat({
                    name: city,
                    airports,
                    index: 0
                });
            }

            return {
                ...state,
                cities: newCities,
            };
        },

        [cityActionTypes.REMOVE_CITY_CLICKED](state, action) {
            return {
                ...state,
                loading: true,
            };
        },

        [cityActionTypes.CITY_REMOVED](state, action) {
            const { data: city } = action;

            const newCities = _.without(state.cities, _.findWhere(state.cities, {name: city}));
            const newGraphData = _.without(state.graphData, _.findWhere(state.graphData, {city}));

            return {
                ...state,
                graphData: newGraphData,
                cities: newCities,
                loading: false,
            };
        },

        [cityActionTypes.CITY_ADDED](state, action) {
            const { data: city} = action;

            const newCities = [].concat(state.cities, {city, index: 0});

            return {
                ...state,
                cities: newCities,
            };
        },

        [appActionTypes.ALL_DATA_LOADED](state, action) {

            const citiesOnChart = getCitiesOnChart(state);

            return {
                ...state,
                citiesOnChart,
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
            
            const newState = {
                ...state,
                displayProduct,
            };

            const citiesOnChart = getCitiesOnChart(newState);

            return assign({}, newState, {citiesOnChart});
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

/*
 * Returns an array of the cities we currently have data for and which are displayed on the chart
 * according to the current UI settings.
 */

function getCitiesOnChart(state) {
    let citiesOnChart = [];
    const product = state.displayProduct.toLowerCase();
    
    citiesOnChart = state.graphData.map((city) => {
        let cityProducts = city.data.data.map((cityData) => cityData.display_name.toLowerCase().trim());
        return cityProducts.indexOf(product) > -1 ? city.city : null;
    })

    return _.compact(citiesOnChart);
}