import React, { Component } from 'react';
import { remote } from 'electron';

import css from '../../../css/element/BarMenu.scss';

class BarMenu extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className='bar-menu'>
                <div id='maximize' onClick={ () => remote.getCurrentWindow().minimize() }></div>
                <div id='minimize' onClick={ () => {
                    let win = remote.getCurrentWindow();
                    if (win.isMaximized()) win.unmaximize();
                    else win.maximize();
                }}></div>
                <div id='exit' onClick={ () => remote.getCurrentWindow().close() }></div>
            </div>
        )
    }
}

export default BarMenu;
