import React, { Component } from 'react';

class Board extends Component {
    constructor() {
        super();

        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.reset = this.reset.bind(this);

        this.state = {
            currTime: 0,
            startTime: 0,
            enabled: false
        };
    }

    componentDidMount() {
        this.start();
    }

    start() {
        this.setState({
            currTime: Date.now(),
            startTime: Date.now(),
            enabled: true,
        });

        this.timer = setInterval(() => {
            this.setState({
                currTime: Date.now()
            });
        });
    }

    stop() {
        this.setState({
            enabled: false
        });

        clearInterval(this.timer);
    }

    reset() {
        this.setState({
            currTime: 0,
            startTime: 0,
            enabled: false
        });
    }

    render() {
        let diff = this.state.currTime - this.state.startTime;
        let ms = (diff % 1000).toString().padStart(3, '0');
        let seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        let minutes = Math.floor(diff / 60000)
        return (
            <span className='timer'>{ minutes }:{ seconds }:{ ms }</span>
        );
    }
}

export default Board;
