import keymirror from 'keymirror';

export const appActionTypes = keymirror({
	NEW_DATA_REQUESTED: null,
	UBER_DATA_SUCCEEDED: null,
	UBER_DATA_FAILED: null,
	COMPARISON_CHANGED: null,
	ALL_DATA_LOADED: null,
});