import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';

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

class VoteCount extends Component {
    constructor(props) {
        super(props);

        this.state = {
            votes: {},
            users: {},
            count:{},
        }
    }

    setupListeners = () => {
        const { showUID, inputID, round, pair } = this.props.ids;

        this.props.firebase.bracketVotes(showUID,inputID,round,pair)
        .on('value', snapshot => {
            const votes = snapshot.val();
            const counts = this.countVotes(votes);
            this.setState({
                counts:counts,
                votes:votes,
            });
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
            const { showUID, inputID, round, pair } = prevProps.ids;
            this.props.firebase.bracketVotes(showUID,inputID,round,pair).off();
            this.setupListeners();
        }
    }

    componentWillUnmount() {
        const { showUID, inputID, round, pair } = this.props.ids;
        this.props.firebase.bracketVotes(showUID,inputID,round,pair).off();
        this.props.firebase.users().off();
    }

    countVotes = votes => {
        const counts = {};
        if (!votes) return counts;
        Object.keys(votes).forEach(voter => {
            const vote = votes[voter];
            const { teamUID, userUID } = vote;
            if (!counts[teamUID]) counts[teamUID] = {};
            const team = counts[teamUID];
            if (!team[userUID]) team[userUID] = 0;
            team[userUID] += 1;
        });
        return counts;
    }

    render() {
        const { counts, users } = this.state;
        
        return(
            <Box m={2}>
            {counts &&
            <Grid container spacing={2}>
                <Grid container spacing={2}>
                {Object.keys(counts).map(cTeamUID => (
                    <Grid item xs={12} container spacing={2}>
                    {Object.keys(counts[cTeamUID]).map(candidateUID => {
                        const count = counts[cTeamUID][candidateUID];
                        const username = users[candidateUID] ? users[candidateUID].username : 'no name';
                        return (
                            <Grid item xs={12} md={6}>
                                <Typography variant="body2">
                                    {`${username} : ${count}`}
                                </Typography>
                            </Grid>
                        );
                    })}
                    </Grid>
                ))}
                </Grid>
            </Grid>
            }
            </Box>
        )
    }
}

/*-------------------Export-------------------*/ 
export default compose(
    withFirebase,
  )(VoteCount);