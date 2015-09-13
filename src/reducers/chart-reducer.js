import _ from 'underscore';
import createReducer from '../utils/create-reducer';
import { initialLocations, productList } from '../config';

const initialState = {
    product: 'uberX',
    compare: 'estimates/price',
    cities: initialLocations,
    graphData: {},
};

export function chart(state = initialState, action = {}) {
    return createReducer(state, action, {
        ['UBER_DATA_LOADED'](state, action) {
            return {
                ...state,
            };
        },
    });
}