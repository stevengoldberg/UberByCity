import assign from 'object-assign';
import _ from 'underscore';

export default function createReducer(state, action, actionMap) {
    const reduceFn = actionMap[action.type];

    if (!_.isUndefined(reduceFn) && !_.isFunction(reduceFn)) {
        throw new Error('Reducer action handler must be a function');
    }

    return reduceFn ? reduceFn(state, action) : state;
}