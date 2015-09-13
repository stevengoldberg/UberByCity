import _ from 'underscore';
import createReducer from '../utils/create-reducer';
import { initialLocations, productList } from '../config';
import assign from 'object-assign';
import { appActions } from '../constants/app-actions';
import { cityActions } from '../constants/city-actions';


const initialState = {
    displayProduct: 'uberX',
    compare: 'estimates/price',
    cities: initialLocations,
    graphData: [],
};

export function chart(state = initialState, action = {}) {
    return createReducer(state, action, {
        [appActions.UBER_DATA_SUCCEEDED](state, action) {
            const { data: { city, times = {}, prices = {} } } = action;
            let newGraphData;
            
            if(!_.findWhere(state.graphData, {city: city})) {
                newGraphData = [
                    ...state.graphData,
                    {
                        city,
                        data: {
                            times,
                            prices,
                        },
                    },
                ];
            } else {
                newGraphData = state.graphData;
            }

            return {
                ...state,
                graphData: newGraphData,
            };
        },

        [cityActions.CITY_REMOVED](state, action) {
            const { data: city } = action;

            const newCities = _.without(state.cities, city);
            const newGraphData = _.without(state.graphData, _.findWhere(state.graphData, {city: city}));

            return {
                ...state,
                graphData: newGraphData,
                cities: newCities,
            };
        },

        [cityActions.CITY_ADDED](state, action) {
            const { data: city} = action;

            const newCities = [].concat(state.cities, city);

            return {
                ...state,
                cities: newCities,
            };
        }
    });
}