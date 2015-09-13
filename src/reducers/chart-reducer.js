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
    graphData: {},
};

export function chart(state = initialState, action = {}) {
    return createReducer(state, action, {
        [appActions.UBER_DATA_SUCCEEDED](state, action) {
            const { data: { city, times = {}, prices = {} } } = action;

            return {
                ...state,
                graphData: [
                    ...state.graphData,
                    {
                        city: city,
                        data: {
                            times,
                            prices,
                        },
                    },
                ],
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
    });
}