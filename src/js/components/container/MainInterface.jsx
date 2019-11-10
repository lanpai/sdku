import React, { Component } from 'react';
import { connect } from 'react-redux';

import css from '../../../css/container/MainInterface.scss';

import Menu from './Menu.jsx';
import Board from '../element/Board.jsx';
import Sudoku from '../../../Sudoku';

const mapStateToProps = state => {
    return {
        theme: state.theme,
        active: state.active,
        difficulty: state.settings.difficulty
    }
};

class MainInterface extends Component {
    constructor() {
        super();
    }

    render() {
        document.body.style.backgroundColor = this.props.theme.background;

        let current = null;

        let difficulty = 0;
        switch (this.props.difficulty) {
            case 'easy':
                difficulty = 30;
                break;
            case 'normal':
                difficulty = 45;
                break;
            case 'hard':
                difficulty = 55;
                break;
        }

        switch (this.props.active) {
            case 'menu':
                current = (
                    <Menu theme={ this.props.theme } />
                );
                break;
            case 'board':
                current = (
                    <Board
                        rows={ 9 } cols={ 9 }
                        difficulty={ difficulty }
                        theme={ this.props.theme } />
                );
                break;
        }

        return (
            <>
                { current }
            </>
        );
    }
}

export default connect(mapStateToProps)(MainInterface);
