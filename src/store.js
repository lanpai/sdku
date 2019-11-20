import { createStore } from 'redux';
import GetTheme from './themes';

import update from 'immutability-helper';

const initialState = {
    active: 'menu',
    theme: {
        name: localStorage.getItem('settings.theme.name') || 'blossom',
        ...GetTheme(localStorage.getItem('settings.theme.name') || 'blossom')
    },
    settings: {
        difficulty: localStorage.getItem('settings.difficulty') || 'normal',
        perfect: localStorage.getItem('settings.perfect') === 'true',
        stopwatch: localStorage.getItem('settings.stopwatch') === 'true',
        stopwatchSetting: parseInt(localStorage.getItem('settings.stopwatchSetting')) || 10,
        handicap: localStorage.getItem('settings.handicap') === 'true'
    },
    leaderboard: {
        easy: JSON.parse(localStorage.getItem('leaderboard.easy')) || [],
        normal: JSON.parse(localStorage.getItem('leaderboard.normal')) || [],
        hard: JSON.parse(localStorage.getItem('leaderboard.hard')) || []
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
            localStorage.setItem(`settings.${action.payload}`, !state.settings[action.payload]);
            return update(state, {
                settings: {
                    $toggle: [ action.payload ]
                }
            });
        case 'SET_MODE':
            localStorage.setItem(`settings.${action.payload.mode}`, action.payload.setting);
            return update(state, {
                settings: {
                    [ action.payload.mode ]: {
                        $set: action.payload.setting
                    }
                }
            });
        case 'SWITCH_DIFFICULTY':
            localStorage.setItem('settings.difficulty', action.payload);
            return update(state, {
                settings: {
                    difficulty: {
                        $set: action.payload
                    }
                }
            });
        case 'SUBMIT_SCORE':
            let leaderboard = state.leaderboard[action.payload.difficulty];
            leaderboard.push(action.payload.score);
            localStorage.setItem(`leaderboard.${action.payload.difficulty}`, JSON.stringify(leaderboard));
            return update(state, {
                leaderboard: {
                    [ action.payload.difficulty ]: {
                        $set: leaderboard
                    }
                }
            });
        case 'SWITCH_THEME':
            localStorage.setItem(`settings.theme.name`, action.payload.theme);
            return update(state, {
                theme: {
                    $set: GetTheme(action.payload.theme)
                }
            });
        default:
            return state;
    }
}

const store = createStore(reducer);

export default store;
