import React, { Component } from 'react';
import { connect } from 'react-redux';

import css from '../../../css/container/Menu.scss';

import Circle from '../element/Circle.jsx';

import { SwitchActive, ToggleMode, SwitchDifficulty } from '../../../actions';

const mapStateToProps = state => {
    return {
        difficulty: state.settings.difficulty,
        perfect: state.settings.perfect,
        stopWatch: state.settings.stopWatch
    }
};

class Menu extends Component {
    constructor() {
        super();
    }

    render() {
        let stylesheet = {
            color: this.props.theme.secondary
        };

        return (
            <div className='menu' style={ stylesheet }>
                <div>
                    <div className='title'>sdku</div>
                    <div className='desc'>
                        minimalist sudoku
                    </div>
                </div>
                <div>
                    <div className='flex-row'>
                        <div className='flex-item'>
                            <Circle
                                theme={ this.props.theme }
                                active={ this.props.perfect }
                                onClick={ () => ToggleMode('perfect') }
                                sub='mode'>
                                perfect
                            </Circle>
                        </div>
                        <div className='flex-item'>
                            <Circle
                                theme={ this.props.theme }
                                solid
                                onClick={ () => SwitchActive('board') }>
                                start
                            </Circle>
                        </div>
                        <div className='flex-item'>
                            <Circle
                                theme={ this.props.theme }
                                active={ this.props.stopWatch }
                                onClick={ () => ToggleMode('stopWatch') }
                                sub='mode'>
                                stopwatch
                            </Circle>
                        </div>
                    </div>
                    <div className='flex-row'>
                        <div className='flex-item'>
                            <Circle
                                theme={ this.props.theme }
                                active={ this.props.difficulty === 'easy' }
                                onClick={ () => SwitchDifficulty('easy') }
                                sub='difficulty'>
                                easy
                            </Circle>
                        </div>
                        <div className='flex-item'>
                            <Circle
                                theme={ this.props.theme }
                                active={ this.props.difficulty === 'normal' }
                                onClick={ () => SwitchDifficulty('normal') }
                                sub='difficulty'>
                                normal
                            </Circle>
                        </div>
                        <div className='flex-item'>
                            <Circle
                                theme={ this.props.theme }
                                active={ this.props.difficulty === 'hard' }
                                onClick={ () => SwitchDifficulty('hard') }
                                sub='difficulty'>
                                hard
                            </Circle>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default connect(mapStateToProps)(Menu);
