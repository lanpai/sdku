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
        let stylesheet = {
            color: this.props.theme.secondary
        };
        if (this.props.solid)
            stylesheet.borderColor = this.props.theme.secondary;
        if (this.props.active) {
            stylesheet.color = this.props.theme.background;
            stylesheet.backgroundColor = this.props.theme.primary;
        }

        return (
            <div className='circle'>
                <div style={ stylesheet } onClick={ this.onClick }>
                    <div>
                        { this.props.children }
                    </div>
                </div>
            </div>
        );
    }
}

export default Circle
