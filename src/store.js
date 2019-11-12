import { createStore } from 'redux';

import update from 'immutability-helper';

const initialState = {
    active: 'menu',
    theme: {
        background: '#F7EBEC',
        highlight: '#AC9FBB',
        primary: '#DDBDD5',
        secondary: '#59656F',
        tertiary: '#1D1E2C',
        error: '#ED5858'
    },
    settings: {
        difficulty: 'normal',
        perfect: false,
        stopwatch: false,
        stopwatchSetting: 10
    }
}

function reducer(state = initialState, action) {
    switch (action.type) {
        case 'SWITCH_ACTIVE':
            return update(state, {
                active: {
                    $set: action.payload
                }
            });
        case 'TOGGLE_MODE':
            return update(state, {
                settings: {
                    $toggle: [ action.payload ]
                }
            });
        case 'SET_MODE':
            return update(state, {
                settings: {
                    [ action.payload.mode ]: {
                        $set: action.payload.setting
                    }
                }
            });
        case 'SWITCH_DIFFICULTY':
            return update(state, {
                settings: {
                    difficulty: {
                        $set: action.payload
                    }
                }
            });
        default:
            return state;
    }
}

const store = createStore(reducer);

export default store;
