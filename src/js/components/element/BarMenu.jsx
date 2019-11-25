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
                <div id='maximize' onClick={ remote.getCurrentWindow().minimize() }></div>
                <div id='minimize'></div>
                <div id='exit'></div>
            </div>
        )
    }
}

export default BarMenu;
