import { cityActions } from '../constants/city-actions';

export function addCity(city) {
	return {
		type: cityActions.CITY_ADDED,
		data: city,
	};
}

export function removeCity(city) {
	return {
		type: cityActions.CITY_REMOVED,
		data: city,
	};
}