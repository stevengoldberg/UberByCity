import { cityActionTypes } from '../constants/city-actions';

export function addCity(city) {
	return {
		type: cityActionTypes.CITY_ADDED,
		data: city,
	};
}

/*
 * Force this to be an async action so that we can update the chart
 */

export function removeCity(city) {
	return dispatch => {
		dispatch({
			type: cityActionTypes.REMOVE_CITY_CLICKED,
		});

		setTimeout(() => {
			dispatch({
			type:cityActionTypes.CITY_REMOVED,
			data: city,
		})}, 250);
	};
}

function deleteCity(city) {
	return {
		type: cityActionTypes.CITY_REMOVED,
		data: city,
	}
}