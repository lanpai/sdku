import React from 'react';
import ReactDOM from 'react-dom';

import MainInterface from './js/components/container/MainInterface.jsx';
import css from './css/main.scss';

import { Provider } from 'react-redux';
import store from './store';

const wrapper = document.getElementById('main-interface');
wrapper ? ReactDOM.render(
    <Provider store={ store }>
        <MainInterface />
    </Provider>,
    wrapper
) : false;
