import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { withSocket } from '../Socket';
import { compose } from 'recompose';

import { resetBracket } from '../Admin/reset/utils';

import P5CanvasAlwaysDrawing from '../Home/p5canvasAlwaysDrawing';
import Countdown from '../Admin/inputControls/countdown';

import {
    Box,
    Grid, Typography,
    Button,
  } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    textInput: {
        background: 'white',
    }
});

class VoteInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: {},
            input: {},
        }
    }

    setupListeners = () => {
        const { showUID, inputID } = this.props.ids;

        this.props.firebase.showWideInput(showUID,inputID)
        .on('child_added', snapshot => {
            const { input } = this.state;
            const value = snapshot.val();
            input[snapshot.key] = value;
            this.setState({ input:input });
        });

        this.props.firebase.bracket(showUID,inputID)
        .on('value', snapshot => {
            const { input } = this.state;
            input.bracket = snapshot.val();
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
            const { showUID, inputID } = prevProps.ids;
            this.props.firebase.showWideInput(showUID,inputID).off();
            this.props.firebase.bracket(showUID,inputID).off();
            this.setupListeners();
        }
    }

    componentWillUnmount() {
        const { showUID, inputID } = this.props.ids;
        this.props.firebase.showWideInput(showUID,inputID).off();
        this.props.firebase.bracket(showUID,inputID).off();
        this.props.firebase.users().off();
    }

    onVote = (round,pair,bTeamUID,bUserUID) => {
        const { showUID,inputID,userUID } = this.props.ids;
        const vote = {
            teamUID:bTeamUID,
            userUID:bUserUID,
        };
        this.props.firebase.bracketVote(showUID,inputID,round,pair,userUID)
        .set(vote);
    }

    areEqualShallow(a, b) {
        for(var key in a) {
            if(!(key in b) || a[key] !== b[key]) {
                return false;
            }
        }
        for(var key in b) {
            if(!(key in a) || a[key] !== b[key]) {
                return false;
            }
        }
        return true;
    }

    render() {
        const { showUID, inputID, teamUID, userUID } = this.props.ids;
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
                </Grid>
                <Grid container spacing={2}>
                {Object.keys(matchup).map(battlerID => {
                    if (battlerID === 'votes') return;
                    const battler = matchup[battlerID];
                    const bUserUID = battler.userUID;
                    const bTeamUID = battler.teamUID;
                    const ids = {
                        showUID:showUID,
                        inputID:inputID,
                        teamUID:teamUID,
                        userUID:userUID,
                    };
                    const firebaseRef = this.props.firebase.individualUserInput(showUID, inputID, bTeamUID, bUserUID);
                    const disabled = input.bracket.rounds[round][pair].votes ?
                        this.areEqualShallow(input.bracket.rounds[round][pair].votes[userUID], battler) :
                        false;
                    return (
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2">
                                {users[bUserUID] && users[bUserUID].username}
                            </Typography>
                            <P5CanvasAlwaysDrawing
                                key={`${inputID}-${bTeamUID}-${bUserUID}`}
                                ids={ids}
                                firebaseRef={firebaseRef}
                                currentBrush={null}
                                currentColor={'black'}
                            />
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => this.onVote(round,pair,bTeamUID,bUserUID)}
                                disabled={disabled}
                            >
                                VOTE
                            </Button>
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
  )(VoteInput);