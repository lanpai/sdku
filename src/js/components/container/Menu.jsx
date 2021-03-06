import React, { Component } from 'react';
import { connect } from 'react-redux';
import orderBy from 'lodash/orderBy';

import css from '../../../css/container/Menu.scss';

import Circle from '../element/Circle.jsx';

import { SwitchActive, ToggleMode, SwitchDifficulty, SwitchTheme } from '../../../actions';

const mapStateToProps = state => {
    return {
        difficulty: state.settings.difficulty,
        perfect: state.settings.perfect,
        stopwatch: state.settings.stopwatch,
        expert: state.settings.expert,
        rotary: state.settings.rotary,
        leaderboard: state.leaderboard[state.settings.difficulty]
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

        let leaderboard = orderBy(this.props.leaderboard, [ 'time' ], [ 'asc' ]);
        let lbComponent = [];
        for (let i = 0; i < (leaderboard.length > 5 ? 5 : leaderboard.length); i++) {
            let date = new Date(leaderboard[i].date);
            let ms = (leaderboard[i].time % 1000).toString().padStart(3, '0');
            let seconds = Math.floor((leaderboard[i].time % 60000) / 1000).toString().padStart(2, '0');
            let minutes = Math.floor(leaderboard[i].time / 60000);

            let mods = '';
            for (let mod of leaderboard[i].mods)
                mods += ` ${mod}`

            lbComponent.push(
                <div key={ date } className='score'>
                    <div>
                        { date.getFullYear() }-{ date.getMonth() }-{ date.getDate() } - { minutes }:{ seconds }:{ ms }
                        <div>{ mods }</div>
                    </div>
                </div>
            );
        }

        return (
            <div className='menu' style={ stylesheet }>
                <div>
                    <span className='title'>sdku</span><br />
                    <span>
                        revamped sudoku
                    </span>
                </div>
                <div>
                    <div className='flex-row'>
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
                                active={ this.props.perfect }
                                onClick={ () => ToggleMode('perfect') }
                                sub='mode'>
                                perfect
                            </Circle>
                        </div>
                        <div className='flex-item'>
                            <Circle
                                theme={ this.props.theme }
                                active={ this.props.stopwatch }
                                onClick={ () => ToggleMode('stopwatch') }
                                sub='mode'>
                                stopwatch
                            </Circle>
                        </div>
                        <div className='flex-item'>
                            <Circle
                                theme={ this.props.theme }
                                active={ this.props.expert }
                                onClick={ () => ToggleMode('expert') }
                                sub='mode'>
                                expert
                            </Circle>
                        </div>
                        <div className='flex-item'>
                            <Circle
                                theme={ this.props.theme }
                                active={ this.props.rotary }
                                onClick={ () => ToggleMode('rotary') }
                                sub='mode'>
                                rotary
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
                <div className='theme-row'>
                    <div className='flex-row'>
                        <div className='flex-item'>
                            <Circle
                                theme={ this.props.theme }
                                active={ this.props.theme.name === 'blossom' }
                                onClick={ () => SwitchTheme('blossom') }
                                sub='blossom'>
                                花
                            </Circle>
                        </div>
                        <div className='flex-item'>
                            <Circle
                                theme={ this.props.theme }
                                active={ this.props.theme.name === 'midnight' }
                                onClick={ () => SwitchTheme('midnight') }
                                sub='midnight'>
                                夜
                            </Circle>
                        </div>
                        <div className='flex-item'>
                            <Circle
                                theme={ this.props.theme }
                                active={ this.props.theme.name === 'ash' }
                                onClick={ () => SwitchTheme('ash') }
                                sub='ash'>
                                灰
                            </Circle>
                        </div>
                        <div className='flex-item'>
                            <Circle
                                theme={ this.props.theme }
                                active={ this.props.theme.name === 'mocha' }
                                onClick={ () => SwitchTheme('mocha') }
                                sub='mocha'>
                                モ
                            </Circle>
                        </div>
                        <div className='flex-item'>
                            <Circle
                                theme={ this.props.theme }
                                active={ this.props.theme.name === 'matcha' }
                                onClick={ () => SwitchTheme('matcha') }
                                sub='matcha'>
                                茶
                            </Circle>
                        </div>
                    </div>
                </div>
                <details className='scoreboard'>
                    <summary>scoreboard ({ this.props.difficulty })</summary>
                    { lbComponent }
                </details>
            </div>
        );
    }
};

export default connect(mapStateToProps)(Menu);
