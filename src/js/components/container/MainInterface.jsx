import React, { Component } from 'react';
import { connect } from 'react-redux';

import css from '../../../css/container/MainInterface.scss';

import Board from '../element/Board.jsx';
import Sudoku from '../../../Sudoku';

const mapStateToProps = state => {
    return {
        theme: state.theme
    }
};

class MainInterface extends Component {
    constructor() {
        super();
    }

    render() {
        document.body.style.backgroundColor = this.props.theme.background;

        let values = [];
        let meta = [];
        for (let row = 0; row < 9; row++) {
            let children = [];
            for (let col = 0; col < 9; col++)
                children.push({
                    isSolid: false,
                });
            values.push([]);
            meta.push(children);
        }

        values = Sudoku.Generate();

        for (let y = 0; y < values.length; y++) {
            for (let x = 0; x < values[y].length; x++)
                if (values[y][x] !== null) meta[y][x].isSolid = true;
        }

        return (
            <Board rows={ 9 } cols={ 9 } initValues={[ values, meta ]} theme={ this.props.theme } />
        );
    }
}

export default connect(mapStateToProps)(MainInterface);
