import _ from 'underscore';

export default function createReducer(state, action, actionMap) {
    const reduceFn = actionMap[action.type];

    return reduceFn ? reduceFn(state, action) : state;
}