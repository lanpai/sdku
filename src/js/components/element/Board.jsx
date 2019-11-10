import React, { Component } from 'react';
import Sudoku from '../../../Sudoku';

import css from '../../../css/element/Board.scss';

import Timer from './Timer.jsx';
import Circle from './Circle.jsx';

class Board extends Component {
    constructor() {
        super();

        this.checkCount = this.checkCount.bind(this);
        this.handleGridClick = this.handleGridClick.bind(this);
        this.switchControl = this.switchControl.bind(this);
        this.createTable = this.createTable.bind(this);

        this.state = {
            values: null,
            meta: null,
            active: null,
            count: [],
            complete: false
        };
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

        console.log(this.props.difficulty);
        values = Sudoku.Generate(this.props.difficulty);

        for (let y = 0; y < values.length; y++) {
            for (let x = 0; x < values[y].length; x++)
                if (values[y][x] !== null) meta[y][x].isSolid = true;
        }

        this.setState({
            values: values,
            meta: meta
        });

        this.checkCount();
    }

    checkCount() {
        let newCount = [];
        for (let i = 0; i < 9; i++)
            newCount.push(0);

        if (this.state.values !== null) {
            for (let y = 0; y < this.state.values.length; y++)
                for (let x = 0; x < this.state.values[y].length; x++)
                    if (this.state.values[y][x] !== null)
                        newCount[this.state.values[y][x] - 1]++;

            let string = '';
            for (let row of this.state.values)
                for (let value of row)
                    string += value ? value : '.';
        }

        this.setState({
            count: newCount
        });
    }

    handleGridClick(x, y, currValue) {
        if (!this.state.meta[y][x].isSolid) {
            let newValue = this.state.active;

            if (currValue === this.state.active)
                newValue = null;

            let newValues = this.state.values.slice();
            newValues[y][x] = newValue;

            let newMeta = this.state.meta.slice();
            newMeta[y][x] = {
                isSolid: false,
            };

            this.setState({
                values: newValues,
                meta: newMeta
            });

            if (Sudoku.CheckComplete(this.state.values)) {
                let newMeta = this.state.meta.slice();
                for (let ysub = 0; ysub < newMeta.length; ysub++) {
                    for (let xsub = 0; xsub < newMeta[y].length; xsub++)
                        newMeta[ysub][xsub].isSolid = true;
                }

                this.setState({
                    meta: newMeta,
                    active: null,
                    complete: true
                });
            }

            this.checkCount();
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
                                className={ this.state.complete ? 'complete' : '' }
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
                        sub={ 9 - this.state.count[i - 1] }>
                        { i }
                    </Circle>
                </div>
            );
        }

        return (
            <>
                <div
                    style={{ color: this.props.theme.secondary }}>
                    <span className='title'>sdku</span><br />
                    <Timer stop={ this.state.complete } />
                </div>
                <div>
                    { this.createTable() }
                </div>
                <div style={{ display: (this.state.complete) ? 'none' : 'flex' }} className='flex-row control'>
                    { controlRow }
                </div>
            </>
        );
    }
}

export default Board;
