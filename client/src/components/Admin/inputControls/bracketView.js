import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';

import {
    Box, Grid, Typography,
    Button,
    Accordion, AccordionSummary, AccordionDetails,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import P5CanvasAlwaysDrawing from '../../Home/p5canvasAlwaysDrawing';
import ResetBracketButton from '../reset/resetBracket';
import Countdown from './countdown';

import { calcNextRound } from '../reset/utils';

class BracketView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            bracket: {},
            listeners: {},
            users: {},
            countdownInterval: null,
        }
    }

    setupListener = () => {
        const { showUID, inputID } = this.props.ids;

        if (showUID === '') return;

        const bracketListener = this.props.firebase.bracket(showUID,inputID)
        .on('value', snapshot => {
            const bracket = snapshot.val();
            this.setState({
                bracket:bracket,
            });
        });

        const { listeners } = this.state;
        listeners.bracket = bracketListener;
        this.setState({ listeners:listeners });
    }

    componentDidMount() {
        this.setupListener();

        this.props.firebase.users()
        .on('value', snapshot => {
            const users = snapshot.val();
            this.setState({ users:users });
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.ids !== this.props.ids) {
            const { showUID, inputID } = prevProps;
            const { listeners } = this.state;
            if (listeners.bracket) {
                this.props.firebase.bracket(showUID,inputID)
                .off('value',listeners.bracket);
            }
            this.setupListener();
        }
    }

    componentWillUnmount() {
        const { showUID, inputID } = this.props.ids;
        this.props.firebase.bracket(showUID,inputID)
        .off();
        this.props.firebase.users().off();
    }

    onSubmit = () => {
        return;
    }

    startBattle = battle => {
        const { showUID, inputID } = this.props.ids;
        battle.startTime = new Date().toString();
        battle.duration = 10000;
        this.props.firebase.currentBattle(showUID,inputID).set(battle);
    }

    onGoToBattle = (round,pair) => {
        const battle = { round: round, pair: pair };
        this.startBattle(battle);
    }

    onNextBattle = () => {
        const { showUID, inputID } = this.props.ids;
        const { bracket } = this.state;
        const nextBattle = {};
        //if last pair, calculate new round
        const { currentBattle } = bracket;
        if (currentBattle.pair + 1 >= bracket.rounds[currentBattle.round].length) {
            const updatedBracket = calcNextRound(bracket);
            this.props.firebase.bracket(showUID,inputID).set(updatedBracket);

            nextBattle.round = Math.min(currentBattle.round + 1, updatedBracket.rounds.length - 1);
            nextBattle.pair = 0;
            this.startBattle(nextBattle);
        } else {
            nextBattle.round = currentBattle.round;
            nextBattle.pair = currentBattle.pair + 1;
            this.startBattle(nextBattle);
        }
    }

    getNextBattle = () => {
        const { bracket } = this.state;
        const { round, pair } = bracket.currentBattle;
        const next_pair = Math.min( pair + 1, bracket.rounds[round].length - 1 );
        const next_battle = {
            round: round,
            pair: next_pair,
        };
        return next_battle;
    }

    getBattleName = (pair,users) => {
        let name = '';
        if (users[pair.a.userUID]) {
            name += users[pair.a.userUID].username;
            if (pair.b && users[pair.b.userUID]) {
                name += ' vs ';
                name += users[pair.b.userUID].username;
            } else {
                name += ' unchallenged';
            }
        }

        return name;
    }

    onCalcNextRound = () => {
        const { showUID, inputID } = this.props.ids;
        const { bracket } = this.state;
        const updatedBracket = calcNextRound(bracket);
        this.props.firebase.bracket(showUID,inputID).set(updatedBracket);
    }

    render() {
        const { showUID, inputID } = this.props.ids;
        const { bracket, users } = this.state;
        return(
            <Box mb={4}>
                <Box mt={4} mb={4}>
                    <Typography variant="h4">{`Bracket for ${inputID}`}</Typography>
                </Box>
                {bracket && bracket.currentBattle && 
                <Box mt={4} mb={4}>
                    <Typography variant="body1">
                        {`Current Battle: Round ${bracket.currentBattle.round} Pair ${bracket.currentBattle.pair}`}
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={this.onNextBattle}
                        // fullWidth={true}
                        size="large"
                        // disabled={disabled}
                    >
                        {`NEXT BATTLE`}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.onCalcNextRound}
                        // fullWidth={true}
                        size="small"
                        // disabled={disabled}
                    >
                        {`CALC NEXT ROUND`}
                    </Button>
                </Box>     
                }
                <Box>
                {users && bracket && bracket.rounds && 
                bracket.rounds.map((round, rIndex) => {
                    return (
                        <Box key={rIndex} mt={4}>
                            <Box mb={1}>
                                <Typography variant="h5">{`Round ${rIndex}`}</Typography>
                            </Box>
                            <Grid container spacing={2} >
                            {round.map((pair, pIndex) => {
                                const name = this.getBattleName(pair,users);
                                const { currentBattle } = bracket;
                                const style = (currentBattle.round === rIndex
                                                && currentBattle.pair === pIndex) ?
                                                {border:'1px solid red'} : {};
                                return (
                                <Grid item xs={12} md={6} key={pIndex}>
                                <Accordion key={rIndex} style={style}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                    >

                                        <Grid container spacing={1}>
                                            <Grid item xs={10}>
                                                <Typography variant="body1">
                                                    {`${pIndex}: ${name}`}
                                                </Typography>
                                            </Grid>
                                            {bracket.currentBattle && bracket.currentBattle.startTime &&
                                             bracket.currentBattle.round === rIndex &&
                                             bracket.currentBattle.pair === pIndex &&
                                            <Countdown
                                                start={bracket.currentBattle.startTime}
                                                from={bracket.currentBattle.duration ? bracket.currentBattle.duration : 0}
                                                timeout={this.onNextBattle}
                                            />
                                            }
                                        </Grid>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Grid container spacing={4}>
                                            <Grid item xs={12}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => this.onGoToBattle(rIndex,pIndex)}
                                                    size="large"
                                                >
                                                    GO
                                                </Button>
                                            </Grid>
                                            {Object.keys(pair).map(p => {
                                                if (p === 'votes') return;
                                                const user = pair[p];
                                                const { userUID, teamUID } = user;
                                                const ids = {
                                                    showUID:showUID,
                                                    inputID:inputID,
                                                    teamUID:teamUID,
                                                    userUID:userUID,
                                                };
                                                const firebaseRef = this.props.firebase.individualUserInput(showUID, inputID, teamUID, userUID);
                                                return (
                                                    <Grid item xs={12} key={p}>
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
                                    </AccordionDetails>
                                </Accordion>
                                </Grid>
                            )})}
                            </Grid>
                        </Box>
                    )
                })}
                </Box>

                <ResetBracketButton showUID={showUID} inputID={inputID} />

            </Box>
        );
    }
}

export default compose(
    withFirebase,
  )(BracketView);