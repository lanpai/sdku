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
        };
    }

    componentDidMount() {
        this.start();
    }

    start() {
        let now = Date.now();

        this.setState({
            currTime: now,
            startTime: now,
        });

        this.timer = setInterval(() => {
            this.setState({
                currTime: Date.now()
            });
        }, 1);
    }

    stop() {
        clearInterval(this.timer);
    }

    reset() {
        this.setState({
            currTime: 0,
            startTime: 0,
        });
    }

    render() {
        if (this.props.stop)
            this.stop();
        if (this.props.reset)
            this.reset();

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
