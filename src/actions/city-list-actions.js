import { cityActionTypes } from '../constants/city-actions';

export function addCity(city) {
	return {
		type: cityActionTypes.CITY_ADDED,
		data: city,
	};
}

export function removeCity(city) {
	return {
		type: cityActionTypes.CITY_REMOVED,
		data: city,
	};
}