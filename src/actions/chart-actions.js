import $ from 'jquery';
import _ from 'underscore';
import assign from 'object-assign';

import { appActions } from '../constants/app-actions';

import { uberURI, geocodeURI, airportURI, airportToken, uberToken } from '../config';

export function requestData(options) {
    const { cities, compare } = options;

    return dispatch => {
        dispatch({
            type: appActions.NEW_DATA_REQUESTED,
            data: options
        });

        cities.forEach((city) => {
            const airport = airportLookup(city)
                .then(result => {
                    return {
                        name: 'airport',
                        lat: result.airports[0].lat,
                        lng: result.airports[0].lng,
                    };
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
                    return uberLookup({
                        type: compare,
                        start_lat: airport.lat,
                        start_lng: airport.lng,
                        end_lat: cityCenter.lat,
                        end_lng: cityCenter.lng,
                    });
                })
                .then(result => {
                    const data = assign({}, result, { city });
                    dispatch({
                        type: appActions.UBER_DATA_SUCCEEDED,
                        data,
                    });
                });
        });

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