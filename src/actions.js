import store from './store';

function SwitchActive(active) {
    store.dispatch({
        type: 'SWITCH_ACTIVE',
        payload: active
    });
}

function ToggleMode(mode) {
    store.dispatch({
        type: 'TOGGLE_MODE',
        payload: mode
    });
}

function SetMode(mode, setting) {
    store.dispatch({
        type: 'SET_MODE',
        payload: { mode: mode, setting: setting }
    });
}

function SwitchDifficulty(difficulty) {
    store.dispatch({
        type: 'SWITCH_DIFFICULTY',
        payload: difficulty
    });
}

export { SwitchActive, ToggleMode, SwitchDifficulty };
