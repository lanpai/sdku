import React, { Component } from 'react';
import { connect } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faBackspace as faUndo, faTrashAlt, faBars } from '@fortawesome/free-solid-svg-icons';
import Sudoku from '../../../Sudoku';
import { SwitchActive, SubmitScore } from '../../../actions';

import css from '../../../css/element/Board.scss';

import Timer from './Timer.jsx';
import Circle from './Circle.jsx';

const mapStateToProps = state => {
    let leaderboard = filter(state.leaderboard[state.settings.difficulty], score => {
        if (state.settings.perfect && score.mods.indexOf('perfect') === -1)
            return false;
        if (state.settings.stopwatch && score.mods.indexOf(`stopwatch (${state.settings.stopwatchSetting}s)`) === -1)
            return false;
        if (state.settings.expert && score.mods.indexOf('expert') === -1)
            return false;
        if (state.settings.rotary && score.mods.indexOf('rotary') === -1)
            return false;
        return true;
    });

    return {
        theme: state.theme,
        difficulty: state.settings.difficulty,
        perfect: state.settings.perfect,
        stopwatch: state.settings.stopwatch,
        stopwatchSetting: state.settings.stopwatchSetting,
        expert: state.settings.expert,
        rotary: state.settings.rotary,
        leaderboard: leaderboard
    }
};

class Board extends Component {
    constructor() {
        super();

        this.resetWatch = this.resetWatch.bind(this);
        this.startWatch = this.startWatch.bind(this);
        this.stopWatch = this.stopWatch.bind(this);
        this.checkCount = this.checkCount.bind(this);
        this.handleEndCondition = this.handleEndCondition.bind(this);
        this.undo = this.undo.bind(this);
        this.clear = this.clear.bind(this);
        this.handleGridClick = this.handleGridClick.bind(this);
        this.switchControl = this.switchControl.bind(this);
        this.createTable = this.createTable.bind(this);

        this.state = {
            values: null,
            answer: null,
            meta: null,
            playing: false,
            active: null,
            count: [],
            className: '',
            description: '',
            moveHistory: [],
            timer: null,
            currTime: 0,
            startTime: 0,
            initTime: 0,
            animationStarted: false,
            note: false
        };
    }

    resetWatch() {
        let now = Date.now();

        if (this.state.initTime === 0)
            this.state.initTime = now;

        this.setState({
            currTime: now,
            startTime: now
        });
    }

    startWatch() {
        this.resetWatch();

        this.timer = setInterval(() => {
            let currTime = Date.now();

            if (this.props.stopwatch) {
                let diff = currTime - this.state.startTime;
                if (diff >= this.props.stopwatchSetting * 1000) {
                    currTime = this.state.startTime + this.props.stopwatchSetting * 1000;
                    this.handleEndCondition('failure');
                }
            }
            this.setState({
                currTime: currTime
            });
        }, 34);
    }

    stopWatch() {
        clearInterval(this.timer);
    }

    componentDidMount() {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.switchControl(0, 0, parseInt(e.key));
                    break;
                case '0':
                case 'n':
                    this.setState({ note: !this.state.note });
                    break;
                case 'z':
                    e.ctrlKey && this.undo();
            }
        });

        let timeStart = Date.now();

        let values = [];
        let meta = [];

        for (let y = 0; y < 9; y++) {
            let children = [];
            for (let x = 0; x < 9; x++)
                children.push({
                    isSolid: false,
                    style: {},
                    notes: null
                });
            values.push([]);
            meta.push(children);
        }


        let difficulty = 0;
        switch (this.props.difficulty) {
            case 'easy':
                values = Sudoku.Generate(35);
                break;
            case 'normal':
                values = Sudoku.Generate(45);
                break;
            case 'hard':
                values = Sudoku.Generate(50);
                break;
            case 'extra':
                values = Sudoku.Generate(55);
                break;
        }

        let answer = cloneDeep(values);
        Sudoku.Solve(answer);

        for (let y = 0; y < 9; y++)
            for (let x = 0; x < 9; x++)
                if (values[y][x] !== null)
                    meta[y][x].isSolid = true;

        this.state.values = values;
        this.state.meta = meta;
        this.state.answer = answer;
        this.state.playing = true;

        this.startWatch();

        console.log('timing: ', Date.now() - timeStart);
    }

    componentWillUnmount() {
        this.stopWatch();
    }

    checkCount() {
        let count = [];
        for (let i = 0; i < 9; i++)
            count.push(0);

        if (this.state.values !== null) {
            for (let y = 0; y < this.state.values.length; y++)
                for (let x = 0; x < this.state.values[y].length; x++)
                    if (this.state.values[y][x] !== null)
                        count[this.state.values[y][x] - 1]++;

            let string = '';
            for (let row of this.state.values)
                for (let value of row)
                    string += value ? value : '.';
        }

        return count;
    }

    handleEndCondition(className) {
        this.stopWatch();

        let newMeta = cloneDeep(this.state.meta);
        if (className === 'complete') {
            for (let y = 0; y < newMeta.length; y++) {
                for (let x = 0; x < newMeta[y].length; x++)
                    newMeta[y][x].isSolid = true;
            }

            this.state.currTime = Date.now();
            let diff = this.state.currTime - this.state.initTime;
            let isTop = true;
            for (let score of this.props.leaderboard) {
                if (score.time < diff) {
                    isTop = false;
                    break;
                }
            }

            if (isTop) {
                let mods = [];
                if (this.props.perfect)
                    mods.push('perfect');
                if (this.props.stopwatch)
                    mods.push(`stopwatch (${this.props.stopwatchSetting}s)`);
                if (this.props.expert)
                    mods.push('expert');
                if (this.props.rotary)
                    mods.push('rotary');

                SubmitScore(this.props.difficulty, diff, mods);
            }
        }

        this.setState({
            meta: newMeta,
            active: null,
            playing: false,
            className: className
        });
    }

    undo() {
        if (this.state.playing && this.state.moveHistory.length > 0) {
            let newValues = cloneDeep(this.state.values);
            let latest = this.state.moveHistory[this.state.moveHistory.length - 1];

            newValues[latest[0]][latest[1]] = latest[2];

            this.state.moveHistory.pop();

            this.setState({
                values: newValues
            });
        }
    }

    clear() {
        if (this.state.playing) {
            let newValues = cloneDeep(this.state.values);
            let newMeta = cloneDeep(this.state.meta);
            for (let y = 0; y < this.state.meta.length; y++) {
                for (let x = 0; x < this.state.meta[y].length; x++) {
                    if (!this.state.meta[y][x].isSolid) {
                        newValues[y][x] = null;
                        newMeta[y][x].notes = null;
                    }
                }
            }

            this.setState({
                values: newValues,
                meta: newMeta
            });
        }
    }

    handleGridClick(x, y, currValue) {
        if (this.state.playing && !this.state.meta[y][x].isSolid && !this.state.animationStarted) {
            let newValue = this.state.active;

            if (this.state.note) {
                let newValues = cloneDeep(this.state.values);
                let newMeta = cloneDeep(this.state.meta);

                if (newValue === null)
                    newMeta[y][x].notes = null;
                else {
                    if (newMeta[y][x].notes === null)
                        newMeta[y][x].notes = [];
                    else if (newMeta[y][x].notes[this.state.active - 1])
                        newValue = null;

                    newMeta[y][x].notes[this.state.active - 1] = newValue;

                    for (let i = newMeta[y][x].notes.length - 1; i >= 0; i--) {
                        if (newMeta[y][x].notes[i] === null)
                            newMeta[y][x].notes.pop();
                        else
                            break;
                    }

                    if (newMeta[y][x].notes.length === 0)
                        newMeta[y][x].notes = null;

                    newValues[y][x] = null;
                }

                this.setState({
                    values: newValues,
                    meta: newMeta
                });
                return;
            }

            if (currValue === this.state.active)
                newValue = null;

            if (this.props.perfect && newValue === null)
                return;

            let newValues = cloneDeep(this.state.values);
            newValues[y][x] = newValue;

            this.state.moveHistory.push([ y, x, currValue, newValue ]);

            if (this.props.perfect && this.state.active !== this.state.answer[y][x]) {
                this.handleEndCondition('failure');
                let newMeta = cloneDeep(this.state.meta);
                newValues[y][x] = `${this.state.active}/${this.state.answer[y][x]}`;
                newMeta[y][x] = {
                    isSolid: true,
                    style: {
                        fill: this.props.theme.error,
                        borderColor: this.props.theme.error,
                        opacity: 1
                    }
                };
                this.setState({
                    values: newValues,
                    meta: newMeta
                });
                return;
            }

            if (Sudoku.CheckComplete(newValues)) {
                this.setState({
                    values: newValues
                });
                this.handleEndCondition('complete');
                return;
            }

            if (this.props.stopwatch)
                this.resetWatch();

            if (this.props.rotary) {
                let rotatedValues = [];
                let rotatedAnswer = [];
                let rotatedMeta = [];
                let rotatedMoveHistory = [];

                for (let ysub = 0; ysub < 9; ysub++) {
                    rotatedValues.push([]);
                    rotatedAnswer.push([]);
                    rotatedMeta.push([]);
                    for (let xsub = 0; xsub < 9; xsub++) {
                        rotatedValues[ysub][xsub] = newValues[xsub][-ysub + 8];
                        rotatedAnswer[ysub][xsub] = this.state.answer[xsub][-ysub + 8];
                        rotatedMeta[ysub][xsub] = this.state.meta[xsub][-ysub + 8];
                    }
                }
                for (let i = 0; i < this.state.moveHistory.length; i++) {
                    let ysub = this.state.moveHistory[i][0];
                    let xsub = this.state.moveHistory[i][1];
                    this.state.moveHistory[i] = [
                        -xsub + 8,
                        ysub,
                        this.state.moveHistory[i][2],
                        this.state.moveHistory[i][3]
                    ];
                }

                this.setState({
                    values: rotatedValues,
                    answer: rotatedAnswer,
                    meta: rotatedMeta,
                    animationStarted: true
                });

                setTimeout(() => {
                    this.setState({
                        animationStarted: false
                    });
                }, 400);

                return;
            }

            this.setState({
                values: newValues
            });
        }
    }

    switchControl(x, y, currValue) {
        this.state.active === currValue && (currValue = null);
        this.setState({
            active: parseInt(currValue)
        });
    }

    createTable() {
        let table = [];

        if (this.state.values !== null) {
            for (let row = 0; row < this.state.values.length; row++) {
                let children = [];
                for (let col = 0; col < this.state.values[row].length; col++) {
                    let value = this.state.values[row][col];
                    let meta = this.state.meta[row][col];

                    children.push(
                        <div
                            className='flex-item'
                            key={ col }
                            style={ (col % 3 === 2 ? { borderRightColor: this.props.theme.primary } : {}) }>
                            <Circle
                                className={ this.state.className }
                                style={ this.state.meta[row][col].style }
                                theme={ this.props.theme }
                                solid={ meta.isSolid }
                                active={
                                    value === this.state.active && this.state.active !== null &&
                                    !this.props.expert
                                }
                                row={ row }
                                col={ col }
                                onClick={ this.handleGridClick }
                                tile
                                notes={ this.state.meta[row][col].notes }>
                                { value }
                            </Circle>
                        </div>
                    );
                }

                table.push(
                    <div 
                        className='flex-row'
                        key={ row }
                        style={ (row % 3 === 2 ? { borderBottomColor: this.props.theme.primary } : {}) }>
                        { children }
                    </div>
                );
            }
        }

        return table;
    }

    render() {
        let count = this.checkCount();

        let watchDiff = this.state.currTime - this.state.startTime;
        if (!this.state.playing)
            watchDiff = this.state.currTime - this.state.initTime;
        else if (this.props.stopwatch)
            watchDiff = (this.props.stopwatchSetting * 1000) - watchDiff;

        let rotationStyle = {};
        if (this.state.animationStarted) {
            rotationStyle.animationName = 'board-rotate-anim';
            rotationStyle.animationDuration = '400ms';
        }

        return (
            <>
                <div
                    style={{ color: this.props.theme.secondary, fill:this.props.theme.secondary }}>
                    <span className='title'>sdku</span><br />
                    <Timer time={ watchDiff } />
                    <div className='button-menu'>
                        { !this.props.perfect &&
                            <>
                                <span onClick={ this.undo }><Icon icon={ faUndo } />&nbsp;</span>
                                <span onClick={ this.clear }><Icon icon={ faTrashAlt } />&nbsp;</span>
                            </>
                        }
                        <span onClick={ () => SwitchActive('menu') }><Icon icon={ faBars } /></span>
                    </div>
                </div>
                <div
                    className={ 'board' + (this.state.animationStarted ? ' rotate' : '') }
                    style={ rotationStyle }>
                    { this.createTable() }
                </div>
                <div className={ 'control' + (!this.state.playing ? ' complete' : '') }>
                    <div className='flex-row'>
                        <div className='flex-item'>
                            <Circle
                                theme={ this.props.theme }
                                solid
                                active={ 1 === this.state.active }
                                onClick={ this.switchControl }
                                sub={ this.props.expert ? null : 9 - count[0] }
                                tile>
                                1
                            </Circle>
                        </div>
                        <div className='flex-item'>
                            <Circle
                                theme={ this.props.theme }
                                solid
                                active={ 2 === this.state.active }
                                onClick={ this.switchControl }
                                sub={ this.props.expert ? null : 9 - count[1] }
                                tile>
                                2
                            </Circle>
                        </div>
                        <div className='flex-item'>
                            <Circle
                                theme={ this.props.theme }
                                solid
                                active={ 3 === this.state.active }
                                onClick={ this.switchControl }
                                sub={ this.props.expert ? null : 9 - count[2] }
                                tile>
                                3
                            </Circle>
                        </div>
                        <div className='flex-item'>
                            <Circle
                                theme={ this.props.theme }
                                solid
                                active={ 4 === this.state.active }
                                onClick={ this.switchControl }
                                sub={ this.props.expert ? null : 9 - count[3] }
                                tile>
                                4
                            </Circle>
                        </div>
                        <div className='flex-item'>
                            <Circle
                                theme={ this.props.theme }
                                solid
                                active={ 5 === this.state.active }
                                onClick={ this.switchControl }
                                sub={ this.props.expert ? null : 9 - count[4] }
                                tile>
                                5
                            </Circle>
                        </div>
                        <div className='flex-item'>
                            <Circle
                                theme={ this.props.theme }
                                solid
                                active={ 6 === this.state.active }
                                onClick={ this.switchControl }
                                sub={ this.props.expert ? null : 9 - count[5] }
                                tile>
                                6
                            </Circle>
                        </div>
                        <div className='flex-item'>
                            <Circle
                                theme={ this.props.theme }
                                solid
                                active={ 7 === this.state.active }
                                onClick={ this.switchControl }
                                sub={ this.props.expert ? null : 9 - count[6] }
                                tile>
                                7
                            </Circle>
                        </div>
                        <div className='flex-item'>
                            <Circle
                                theme={ this.props.theme }
                                solid
                                active={ 8 === this.state.active }
                                onClick={ this.switchControl }
                                sub={ this.props.expert ? null : 9 - count[7] }
                                tile>
                                8
                            </Circle>
                        </div>
                        <div className='flex-item'>
                            <Circle
                                theme={ this.props.theme }
                                solid
                                active={ 9 === this.state.active }
                                onClick={ this.switchControl }
                                sub={ this.props.expert ? null : 9 - count[8] }
                                tile>
                                9
                            </Circle>
                        </div>
                        <div
                            className='flex-item'
                            key='note'>
                            <Circle
                                theme={ this.props.theme }
                                solid
                                active={ this.state.note }
                                onClick={ () => this.setState({ note: !this.state.note }) }
                                svg={ <Icon icon={ faPencilAlt } /> }>
                            </Circle>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default connect(mapStateToProps)(Board);
