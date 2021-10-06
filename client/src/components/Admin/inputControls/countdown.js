import React, { Component } from 'react';

import {
    Box, Grid, Typography,
} from '@material-ui/core';

class Countdown extends Component {
    constructor(props) {
        super(props);

        this.state = {
            time: '',
            interval: null,
        }
    }

    secondsDifference = (t1,t2) => {
        var dif = t1.getTime() - t2.getTime();
        var sVector = dif / 1000;
        return sVector;
    }

    formatTime = t => {
        if (t < 0) return 0;
        else return Math.round(t);
    }

    countup = () => {
        const { start } = this.props;
        if (!start) return;

        const diff = this.secondsDifference(new Date(start), new Date());
        const formatted = this.formatTime(diff);
        this.setState({ time:formatted });
    }

    countdown = () => {
        const { start, from } = this.props;
        if (!start || !from) return;

        const fromTime = new Date(start);
        fromTime.setSeconds(fromTime.getSeconds() + from);

        const diff = this.secondsDifference(fromTime, new Date());
        const formatted = this.formatTime(diff);
        this.setState({ time:formatted });
    }

    restartTimer = () => {
        const { start, from, timeout } = this.props;
        //clear existing interval, if it exists
        const { interval } = this.state;
        clearInterval(interval);
        //initiate the countdown
        this.countdown();
        const newInterval = setInterval(this.countdown, 1000);
        this.setState({ interval:newInterval });
        //ready the timeout function
        if (from && timeout) {
            const fromTime = new Date(start);
            fromTime.setSeconds(fromTime.getSeconds() + from);
            if (new Date() < fromTime) {
                console.log('Next battle in ' + from);
                setTimeout(timeout,from*1000);
            }
        }
    }

    componentDidMount() {
        this.restartTimer();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.start !== this.props.start) {
            this.restartTimer();
        }
    }

    componentWillUnmount() {
        const { interval } = this.state;
        clearInterval(interval);
    }

    render() {
        const { time } = this.state;
        return (
            <Box>
                <Typography variant="body1" color="secondary">
                    {time}
                </Typography>
            </Box>
        );
    }
}

export default Countdown;