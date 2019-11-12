import React, { Component } from 'react';
import { connect } from 'react-redux';

import css from '../../../css/container/MainInterface.scss';

import Menu from './Menu.jsx';
import Board from '../element/Board.jsx';
import Sudoku from '../../../Sudoku';

const mapStateToProps = state => {
    return {
        theme: state.theme,
        active: state.active
    }
};

class MainInterface extends Component {
    constructor() {
        super();
    }

    render() {
        document.body.style.backgroundColor = this.props.theme.background;

        let current = null;
        switch (this.props.active) {
            case 'menu':
                current = (
                    <Menu theme={ this.props.theme } />
                );
                break;
            case 'board':
                current = (
                    <Board
                        rows={ 9 } cols={ 9 } />
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
