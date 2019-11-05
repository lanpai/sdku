import { createStore } from 'redux';

const initialState = {
    theme: {
        background: '#F7EBEC',
        highlight: '#AC9FBB',
        primary: '#DDBDD5',
        secondary: '#59656F',
        tertiary: '#1D1E2C'
    }
}

function reducer(state = initialState, action) {
    switch (action.type) {
        default:
            return state;
    }
}

const store = createStore(reducer);

export default store;
