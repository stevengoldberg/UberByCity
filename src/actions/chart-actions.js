import $ from 'jquery';
import _ from 'underscore';
import assign from 'object-assign';

import { appActionTypes } from '../constants/app-actions';
import * as cityActions from './city-list-actions';

import { uberURI, geocodeURI, airportURI, airportToken, uberToken } from '../config';

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
                        return {
                            name: 'airport',
                            lat: result.airports[0].lat,
                            lng: result.airports[0].lng,
                        };
                    } else {
                        throw new Error(city);
                    }
                });

            const cityCenter = sendGeocodeRequest(city)
                .then(result => {
                    return {
                        name: 'cityCenter',
                        lat: result.results[0].geometry.location.lat,
                        lng: result.results[0].geometry.location.lng,
                    };
                });

            const coordRequests = [cityCenter, airport];
            
            return Promise.all(coordRequests)
                .then(result => {
                    const airport = _.findWhere(result, {name: 'airport'});
                    const cityCenter = _.findWhere(result, {name: 'cityCenter'});
                    let uberOptions;

                    if(compare === 'estimates/price') {
                        uberOptions = {
                            type: compare,
                            start_lat: airport.lat,
                            start_lng: airport.lng,
                            end_lat: cityCenter.lat,
                            end_lng: cityCenter.lng,
                        };
                    } else if(compare === 'estimates/time') {
                        uberOptions = {
                            type: compare,
                            start_lat: airport.lat,
                            start_lng: airport.lng,
                        }
                    };
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
                    dispatch({
                        type: appActionTypes.UBER_DATA_FAILED,
                        data: err,
                    });
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

function uberLookup({type, start_lat, start_lng, end_lat, end_lng } = {}) {
    return new Promise((resolve, reject) => {
        $.ajax(`${uberURI}/${type}?start_latitude=${start_lat}&start_longitude=${start_lng}&end_latitude=${end_lat}&end_longitude=${end_lng}`, {
            method: 'GET',
            headers: {
                Authorization: `Token ${uberToken}`,
            },
            success: (res, status, xhr) => {
                resolve(res);
            },

            error: (xhr, status, error) => {
                reject(error);
            },

        });
    })
}


function airportLookup(city) {
    return new Promise((resolve, reject) => {
        $.ajax(`${airportURI}/${encodeURIComponent(city)}?user_key=${airportToken}`, {
            method: 'GET',
            jsonp: 'callback',
            dataType: 'jsonp',
            success: (res, status, xhr) => {
                resolve(res);
            },

            error: (xhr, status, error) => {
                reject(error);
            },

        });
    });
}

function sendGeocodeRequest(location) {
    return new Promise((resolve, reject) => {
        $.ajax(`${geocodeURI}?address=${location}`, {
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
