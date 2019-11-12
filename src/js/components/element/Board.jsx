import React, { Component } from 'react';
import { connect } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import Sudoku from '../../../Sudoku';
import { SwitchActive } from '../../../actions';

import css from '../../../css/element/Board.scss';

import Timer from './Timer.jsx';
import Circle from './Circle.jsx';

const mapStateToProps = state => {
    return {
        theme: state.theme,
        difficulty: state.settings.difficulty,
        perfect: state.settings.perfect,
        stopwatch: state.settings.stopwatch
    }
};

class Board extends Component {
    constructor() {
        super();

        this.resetWatch = this.resetWatch.bind(this);
        this.startWatch = this.startWatch.bind(this);
        this.stopWatch = this.stopWatch.bind(this);
        this.checkCount = this.checkCount.bind(this);
        this.disableGrid = this.disableGrid.bind(this);
        this.undo = this.undo.bind(this);
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
            startTime: 0
        };
    }

    resetWatch() {
        let now = Date.now();

        this.setState({
            currTime: now,
            startTime: now
        });
    }

    startWatch() {
        this.resetWatch();

        this.timer = setInterval(() => {
            this.setState({
                currTime: Date.now()
            });
        }, 1);
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
            }
        });

        let timeStart = Date.now();

        let values = [];
        let meta = [];
        let answer = [];

        for (let y = 0; y < 9; y++) {
            let children = [];
            for (let x = 0; x < 9; x++)
                children.push({
                    isSolid: false,
                    style: {}
                });
            values.push([]);
            meta.push(children);
        }


        let difficulty = 0;
        switch (this.props.difficulty) {
            case 'easy':
                values = Sudoku.Generate(30);
                break;
            case 'normal':
                values = Sudoku.Generate(45);
                break;
            case 'hard':
                values = Sudoku.Generate(55);
                break;
        }

        answer = cloneDeep(values);
        Sudoku.Solve(answer);

        for (let y = 0; y < 9; y++)
            for (let x = 0; x < 9; x++)
                if (values[y][x] !== null)
                    meta[y][x].isSolid = true;

        this.state.values = values;
        this.state.meta = meta;
        this.setState({
            values: values,
            meta: meta,
            answer: answer,
            playing: true
        });

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

    disableGrid(className) {
        let newMeta = cloneDeep(this.state.meta);
        if (className === 'complete') {
            for (let y = 0; y < newMeta.length; y++) {
                for (let x = 0; x < newMeta[y].length; x++)
                    newMeta[y][x].isSolid = true;
            }
        }

        this.stopWatch();

        this.setState({
            meta: newMeta,
            active: null,
            playing: false,
            className: className,
        });
    }

    undo() {
        if (this.state.moveHistory.length > 0) {
            let newValues = cloneDeep(this.state.values);
            let latest = this.state.moveHistory[this.state.moveHistory.length - 1];

            newValues[latest[0]][latest[1]] = latest[2];

            let newHistory = cloneDeep(this.state.moveHistory);
            newHistory.pop();

            this.setState({
                values: newValues,
                moveHistory: newHistory
            });
        }
    }

    handleGridClick(x, y, currValue) {
        if (this.state.playing) {
            let newValue = this.state.active;

            if (currValue === this.state.active)
                newValue = null;

            let newValues = cloneDeep(this.state.values);
            newValues[y][x] = newValue;

            let newHistory = cloneDeep(this.state.moveHistory);
            newHistory.push([ y, x, currValue, newValue ]);

            console.log(newHistory);
            this.setState({
                values: newValues,
                moveHistory: newHistory
            });

            if (this.props.perfect && this.state.active !== this.state.answer[y][x]) {
                this.disableGrid('failure');
                let newValues = cloneDeep(this.state.values);
                let newMeta = cloneDeep(this.state.meta);
                newValues[y][x] = `${this.state.active}/${this.state.answer[y][x]}`;
                newMeta[y][x].style = { color: this.props.theme.error, opacity: 1 };
                this.setState({
                    values: newValues,
                    meta: newMeta
                });
            }

            if (Sudoku.CheckComplete(this.state.values))
                this.disableGrid('complete');
        }
    }

    switchControl(x, y, currValue) {
        this.state.active === currValue && (currValue = null);
        this.setState({
            active: currValue
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
                                active={ value === this.state.active && this.state.active !== null }
                                row={ row }
                                col={ col }
                                onClick={ this.handleGridClick }>
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

        let tableStyle = {
            borderColor: this.props.theme.secondary
        };

        let controlRow = [];
        for (let i = 1; i <= 9; i++) {
            controlRow.push(
                <div
                    className='flex-item'
                    key={ i }>
                    <Circle
                        theme={ this.props.theme }
                        solid
                        active={ i === this.state.active }
                        onClick={ this.switchControl }
                        sub={ 9 - count[i - 1] }>
                        { i }
                    </Circle>
                </div>
            );
        }

        let watchDiff = this.state.currTime - this.state.startTime;

        let controlClass = 'control';
        if (!this.state.playing)
            controlClass += ' complete';

        return (
            <>
                <div
                    style={{ color: this.props.theme.secondary }}>
                    <span className='title'>sdku</span><br />
                    <Timer time={ watchDiff } />
                    <div className='button-menu'><span onClick={ this.undo }>undo</span> <span onClick={ () => SwitchActive('menu') }>menu</span></div>
                </div>
                <div>
                    { this.createTable() }
                </div>
                <div className={ controlClass }>
                    <div className='flex-row'>
                        { controlRow }
                    </div>
                </div>
            </>
        );
    }
}

export default connect(mapStateToProps)(Board);
