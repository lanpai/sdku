import React, { Component } from 'react';

import css from '../../../css/element/Circle.scss';

class Circle extends Component {
    constructor() {
        super();

        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.props.onClick(this.props.col, this.props.row, this.props.children);
    }

    render() {
        let stylesheet = {};
        let color = this.props.theme.secondary;
        if (this.props.solid)
            stylesheet.borderColor = this.props.theme.secondary;
        if (this.props.active) {
            color = this.props.theme.background;
            stylesheet.backgroundColor = this.props.theme.primary;
        }
        if (!this.props.children && (!this.props.notes || (this.props.notes && !this.props.notes.length)))
            stylesheet.opacity = 0;
        stylesheet = { ...stylesheet, ...this.props.style };

        let fontScale = 1;
        if (this.props.tile)
            fontScale = 2;

        let topHeight = '50%';
        if (this.props.sub !== undefined)
            topHeight = 50 - (7 * fontScale) + '%';

        let component = null;
        if (this.props.children || this.props.sub) {
            component =
                <>
                    <text x='50%' y={ topHeight } fontSize={ 20 * fontScale }>
                        { this.props.children }
                    </text>
                    <text x='50%' y={ 50 + (9 * fontScale) + '%' } fontSize={ 15 * fontScale }>
                        { this.props.sub }
                    </text>
                </>;
        }
        else if (this.props.notes && this.props.notes.length > 0) {
            component =
                <>
                    <text x='25%' y='25%' fontSize={ 12 * fontScale }>
                        { this.props.notes[0] }
                    </text>
                    <text x='50%' y='25%' fontSize={ 12 * fontScale }>
                        { this.props.notes[1] }
                    </text>
                    <text x='75%' y='25%' fontSize={ 12 * fontScale }>
                        { this.props.notes[2] }
                    </text>
                    <text x='25%' y='50%' fontSize={ 12 * fontScale }>
                        { this.props.notes[3] }
                    </text>
                    <text x='50%' y='50%' fontSize={ 12 * fontScale }>
                        { this.props.notes[4] }
                    </text>
                    <text x='75%' y='50%' fontSize={ 12 * fontScale }>
                        { this.props.notes[5] }
                    </text>
                    <text x='25%' y='75%' fontSize={ 12 * fontScale }>
                        { this.props.notes[6] }
                    </text>
                    <text x='50%' y='75%' fontSize={ 12 * fontScale }>
                        { this.props.notes[7] }
                    </text>
                    <text x='75%' y='75%' fontSize={ 12 * fontScale }>
                        { this.props.notes[8] }
                    </text>
                </>;
        }

        return (
            <div className='circle' onClick={ this.onClick }>
                <div className={ this.props.className } style={{ fill: color, ...stylesheet }}>
                    <svg viewBox='0 0 100 100'>
                        { component }
                    </svg>
                </div>
            </div>
        );
    }
}

export default Circle
