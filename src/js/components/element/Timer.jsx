import React, { Component } from 'react';

class Board extends Component {
    constructor() {
        super();
    }

    render() {
        let diff = this.props.time;
        let ms = (diff % 1000).toString().padStart(3, '0');
        let seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        let minutes = Math.floor(diff / 60000)
        return (
            <span className='timer'>{ minutes }:{ seconds }:{ ms }</span>
        );
    }
}

export default Board;
