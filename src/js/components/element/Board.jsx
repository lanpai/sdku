import React, { Component } from 'react';

import css from '../../../css/element/Board.scss';

import Circle from './Circle.jsx';

class Board extends Component {
    constructor() {
        super();

        this.handleGridClick = this.handleGridClick.bind(this);
        this.createTable = this.createTable.bind(this);

        this.state = {
            values: null
        }
    }

    handleGridClick(x, y) {
        if (!this.state.values[y][x].isSolid) {
            let newValues = this.state.values.slice();
            newValues[y][x] = {
                isSolid: false,
                value: this.props.active
            };

            this.setState({
                values: newValues
            });
        }
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
                    <td
                        key={ col }
                        style={ (col % 3 === 2 ? { borderRightColor: this.props.theme.primary } : {}) }>
                        <Circle 
                            theme={ this.props.theme }
                            solid={ value.isSolid }
                            active={ value.value === this.props.active }
                            row={ row }
                            col={ col }
                            onClick={ this.handleGridClick }>
                            { value.value }
                        </Circle>
                    </td>
                );
            }

            table.push(
                <tr
                    key={ row }
                    style={ (row % 3 === 2 ? { borderBottomColor: this.props.theme.primary } : {}) }>
                    { children }
                </tr>
            );
        }

        return table;
    }

    render() {
        let tableStyle = {
            borderColor: this.props.theme.secondary
        };

        return (
            <div className='board'>
                <table style={ tableStyle }>
                    <tbody>
                        { this.createTable(this.props.rows, this.props.cols) }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Board;
