import $ from 'jquery';
import _ from 'underscore';
import assign from 'object-assign';

import { appActionTypes } from '../constants/app-actions';
import * as cityActions from './city-list-actions';

import * as config from 'config';

export function requestData(options) {
    const { cities, compare } = options;

    return dispatch => {
        dispatch({
            type: appActionTypes.NEW_DATA_REQUESTED,
            data: options,
        });

        Promise.all(cities.map((city) => {
            const airport = airportLookup(city)
                .then(result => {
                    if (result.airports.length > 0) {

                        /*
                         * Filter out irrelevant airport results. E.g., the response for hitting the airport
                         * endpoint with "Austin" will include "Austin Straubel Intl" in Green Bay, WI!
                         */

                        const airportList = result.airports.filter((airport) => {
                            return airport.city.toLowerCase().indexOf(city.name.toLowerCase()) > -1;
                        });

                        return {
                            name: 'airports',
                            data: airportList,
                        };
                    } else {
                        throw new Error(city.name);
                    }
                });

            const cityCenter = sendGeocodeRequest(city)
                .then(result => {
                    return {
                        name: 'cityCenter',
                        lat: result.results[0].geometry.location.lat,
                        lng: result.results[0].geometry.location.lng,
                    };
                })
                .catch(err => {
                    dispatch(dataError({message: city}));
                });

            const coordRequests = [cityCenter, airport];
            
            return Promise.all(coordRequests)
                .then(result => {
                    const airports = _.findWhere(result, {name: 'airports'}).data;
                    const cityCenter = _.findWhere(result, {name: 'cityCenter'});
                    
                    /*
                     * The Uber price estimate endpoint takes a start and end location;
                     * the ETA endpoint just takes one location.
                     */

                    let uberOptions = {
                        type: compare,
                        start_lat: airports[0].lat,
                        start_lng: airports[0].lng,
                        cityName: city,
                    };

                    if(compare === 'estimates/price') {
                        uberOptions.end_lat = cityCenter.lat;
                        uberOptions.end_lng = cityCenter.lng;
                    }

                    dispatch({
                        type: appActionTypes.AIRPORTS_LOADED,
                        data: {
                            city,
                            airports,
                        },
                    });

                    return uberLookup(uberOptions);
                })
                .then(result => {
                    const data = assign({}, result, { city });
                    dispatch({
                        type: appActionTypes.UBER_DATA_SUCCEEDED,
                        data,
                    });
                })
                .catch(err => {
                    dispatch(dataError(err));
                })
        }))
        .then(result => {
            dispatch(allDataLoaded());
        });
    };
}

export function changeComparison(data) {
    const { compare, cities } = data;

    requestData(data);
    
    return {
        type: appActionTypes.COMPARISON_CHANGED,
        compare,
    };
}

function uberLookup({type, start_lat, start_lng, end_lat, end_lng, cityName} = {}) {
    return new Promise((resolve, reject) => {
        $.ajax(`${config.uberURI}/${type}?start_latitude=${start_lat}&start_longitude=${start_lng}&end_latitude=${end_lat}&end_longitude=${end_lng}`, {
            method: 'GET',
            headers: {
                Authorization: `Token ${config.uberToken}`,
            },
            success: (res, status, xhr) => {
                resolve(res);
            },

            error: (xhr, status, error) => {
                reject({message: cityName});
            },

        });
    })
}


function airportLookup(city) {
    return new Promise((resolve, reject) => {
        $.ajax(`${config.airportURI}/${encodeURIComponent(city.name)}?user_key=${config.airportToken}`, {
            method: 'GET',
            jsonp: 'callback',
            dataType: 'jsonp',
            success: (res, status, xhr) => {
                resolve(res);
            },

            error: (xhr, status, error) => {
                reject({message: city});
            },

        });
    });
}

function sendGeocodeRequest(location) {
    return new Promise((resolve, reject) => {
        $.ajax(`${config.geocodeURI}?address=${location.name}&key=${config.geocodeToken}`, {
            method: 'GET',
            success: (res, status, xhr) => {
                resolve(res);
            },

            error: (xhr, status, error) => {
                reject(error);
            },

        });
    });
}

function allDataLoaded() {
    return {
        type: appActionTypes.ALL_DATA_LOADED,
    };
}

export function changeDisplayProduct(product) {
    return {
        type: appActionTypes.PRODUCT_CHANGED,
        data: product,
    };
}

export function dataError(error) {
    return {
        type: appActionTypes.UBER_DATA_FAILED,
        error,
    };
}

export function countdownTick() {
    return {
        type: appActionTypes.TIMER_TICK,
    };
}
