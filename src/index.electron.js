import React from 'react';
import ReactDOM from 'react-dom';

import Sudoku from './Sudoku';

import BarMenu from './js/components/element/BarMenu.jsx';
import MainInterface from './js/components/container/MainInterface.jsx';
import css from './css/main.scss';

import { Provider } from 'react-redux';
import store from './store';

const wrapper = document.getElementById('main-interface');
wrapper ? ReactDOM.render(
    <Provider store={ store }>
        <BarMenu />
        <MainInterface />
    </Provider>,
    wrapper
) : false;
