import React, { Component } from 'react';
import { connect } from 'react-redux';
import sudoku from 'sudoku';

import css from '../../../css/container/MainInterface.scss';

import Board from '../element/Board.jsx';

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
        for (let row = 0; row < 9; row++) {
            let children = [];
            for (let col = 0; col < 9; col++)
                children.push({
                    isSolid: false,
                    value: null
                });
            values.push(children);
        }

        let puzzle = sudoku.makepuzzle();
        for (let i = 0; i < puzzle.length; i++) {
            if (puzzle[i]) {
                values[Math.floor(i / 9)][i % 9].isSolid = true;
                values[Math.floor(i / 9)][i % 9].value = puzzle[i] + 1;
            }
        }

        return (
            <Board rows={ 9 } cols={ 9 } initValues={ values } theme={ this.props.theme } />
        );
    }
}

export default connect(mapStateToProps)(MainInterface);
