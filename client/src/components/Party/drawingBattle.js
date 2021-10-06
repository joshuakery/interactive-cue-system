import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { withSocket } from '../Socket';
import { compose } from 'recompose';

import { resetBracket } from '../Admin/reset/utils';

import P5CanvasAlwaysDrawing from '../Home/p5canvasAlwaysDrawing';
import Countdown from '../Admin/inputControls/countdown';
import VoteCount from './voteCount';

import {
    Box,
    Grid, Typography,
  } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    textInput: {
        background: 'white',
    }
});

class DrawingBattle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: {},
            input: {},
        }
    }

    setupListeners = () => {
        const { inputNodes } = this.state;
        const { showUID, inputID } = this.props.ids;

        this.props.firebase.showWideInput(showUID,inputID)
        .on('value', snapshot => {
            const input = snapshot.val();
            if (!input.bracket) {
                console.log('No bracket found. Creating bracket...');
                resetBracket(this.props.firebase,showUID,inputID);
            }
            this.setState({ input:input });
        });

        this.props.firebase.users()
        .on('value', snapshot => {
            const users = snapshot.val();
            this.setState({ users:users });
        });
    }

    componentDidMount() {
        this.setupListeners();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.ids !== this.props.ids) {
            this.props.firebase.showWideInput(prevProps.ids.showUID,prevProps.ids.inputID)
            .off();
            this.setupListeners();
        }
    }

    componentWillUnmount() {
        const { showUID, inputID } = this.props.ids;
        this.props.firebase.showWideInput(showUID,inputID)
        .off();
        this.props.firebase.users().off();
    }

    render() {
        const { showUID, inputID } = this.props.ids;
        const { input, users } = this.state;
        if (!input.bracket) {
            return (<div>loading...</div>)
        }
        const { round, pair, startTime, duration } = input.bracket.currentBattle;
        const matchup = input.bracket.rounds[round][pair];
        
        return(
            <Box m={2}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Countdown start={startTime} from={duration}/>
                    <VoteCount ids={{
                        showUID:showUID,
                        inputID:inputID,
                        round:round,
                        pair:pair,
                    }}/>
                </Grid>
                <Grid container spacing={2}>
                {Object.keys(matchup).map(m => {
                    if (m === 'votes') return;
                    const user = matchup[m];
                    const { userUID, teamUID } = user;
                    const ids = {
                        showUID:showUID,
                        inputID:inputID,
                        teamUID:teamUID,
                        userUID:userUID,
                    };
                    const firebaseRef = this.props.firebase.individualUserInput(showUID, inputID, teamUID, userUID);
                    return (
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2">
                                {users[userUID] && users[userUID].username}
                            </Typography>
                            <P5CanvasAlwaysDrawing
                                key={`${inputID}-${teamUID}-${userUID}`}
                                ids={ids}
                                firebaseRef={firebaseRef}
                                currentBrush={null}
                                currentColor={'black'}
                            />
                        </Grid>
                    )
                })}
                </Grid>
            </Grid>
            </Box>
        )
    }
}

/*-------------------Export-------------------*/ 
export default compose(
    withFirebase,
    withSocket,
  )(DrawingBattle);