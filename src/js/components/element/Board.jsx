import React, { Component } from 'react';
import sudoku from 'sudoku';

import css from '../../../css/element/Board.scss';

import Timer from './Timer.jsx';
import Circle from './Circle.jsx';

class Board extends Component {
    constructor() {
        super();

        this.checkCompletion = this.checkCompletion.bind(this);
        this.handleGridClick = this.handleGridClick.bind(this);
        this.switchControl = this.switchControl.bind(this);
        this.createTable = this.createTable.bind(this);

        this.state = {
            values: null,
            active: 1
        };
    }

    checkCompletion() {
        for (let y = 0; y < this.props.rows; y++) {
            let sum = 0;
            for (let x = 0; x < this.props.cols; x++)
                sum += this.state.values[y][x].value;
            console.log(`row ${y + 1}: ${sum}`);
            if (sum !== 45) return false;
        }
        for (let x = 0; x < this.props.cols; x++) {
            let sum = 0;
            for (let y = 0; y < this.props.rows; y++)
                sum += this.state.values[y][x].value;
            console.log(`col ${x + 1}: ${sum}`);
            if (sum !== 45) return false;
        }
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                let sum = 0;
                for (let xsub = 0; xsub < 3; xsub++) {
                    for (let ysub = 0; ysub < 3; ysub++)
                        sum += this.state.values[y * 3 + ysub][x * 3 + xsub].value;
                }
                console.log(`box ${x + 1}, ${y + 1}: ${sum}`);
                if (sum !== 45) return false;
            }
        }

        return true;
    }

    handleGridClick(x, y, currValue) {
        if (!this.state.values[y][x].isSolid) {
            let newValue = this.state.active;

            if (currValue === this.state.active)
                newValue = null;

            let newValues = this.state.values.slice();
            newValues[y][x] = {
                isSolid: false,
                value: newValue
            };

            this.setState({
                values: newValues
            });

            console.log(this.checkCompletion());
        }
    }

    switchControl(x, y, currValue) {
        this.setState({
            active: currValue
        });
    }

    createTable(rows, cols) {
        if (!this.state.values)
            this.state.values = this.props.initValues;

        let table = [];

        for (let row = 0; row < rows; row++) {
            let children = [];
            for (let col = 0; col < cols; col++) {
                let value = this.state.values[row][col];

                children.push(
                    <div
                        className='flex-item'
                        key={ col }
                        style={ (col % 3 === 2 ? { borderRightColor: this.props.theme.primary } : {}) }>
                        <Circle 
                            theme={ this.props.theme }
                            solid={ value.isSolid }
                            active={ value.value === this.state.active }
                            row={ row }
                            col={ col }
                            onClick={ this.handleGridClick }>
                            { value.value }
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
                        onClick={ this.switchControl }>
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
                    <Timer />
                </div>
                <div>
                    { this.createTable(this.props.rows, this.props.cols) }
                </div>
                <div className='flex-row control'>
                    { controlRow }
                </div>
            </>
        );
    }
}

export default Board;
