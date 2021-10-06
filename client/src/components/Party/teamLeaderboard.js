import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { withSocket } from '../Socket';
import { compose } from 'recompose';

import {
    Box,
    Grid, Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper
  } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    textInput: {
        background: 'white',
    }
});

class TeamLeaderboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            teams: {},
            goals: {},
        }
    }

    componentDidMount() {
        const { showUID, goalsID } = this.props.ids;

        this.props.firebase
        .teams(showUID)
        .on('value',snapshot => {
            //first load in the teams
            const teams = snapshot.val();
            Object.keys(teams).forEach(teamUID => {
                const team = teams[teamUID];
                team.users = {};
            });
            this.setState({ teams:teams });
            //then fetch the users and sort into teams
            this.props.firebase
            .users()
            .on('value',snapshot => {
                const users = snapshot.val();
                const { teams } = this.state;
                //clear out users from teams
                Object.keys(teams).forEach(teamUID => {
                    const team = teams[teamUID];
                    team.users = {};
                });
                //reassign users to teams
                Object.keys(users).forEach(userUID => {
                    const user = users[userUID];
                    if (!user.show === showUID) return;
                    if (!teams[user.team].users) teams[user.team].users = {};
                    teams[user.team].users[userUID] = user;
                });
                this.setState({ teams:teams });
            });
            //if there is a goals ID, prep teams to create empty rows to show goals of bringing in players
            if (goalsID) {
                this.props.firebase
                .showWideInput(showUID,goalsID)
                .on('value', snapshot => {
                    const goals = snapshot.val();
                    this.setState({ goals:goals });
                });
            }
        });
    }

    componentWillUnmount() {
        const { showUID, goalsID } = this.props.ids;
        this.props.firebase.teams(showUID).off();
        this.props.firebase.users().off();
        if (goalsID) this.props.firebase.showWideInput(showUID,goalsID).off();
    }

    getEmptyRows = teamUID => {
        const { teams, goals } = this.state;
        const rows = [];

        if (!goals || !goals[teamUID]) return rows;
        const nUsers = teams[teamUID].users ? Object.keys(teams[teamUID].users).length : 0;
        if (goals[teamUID] < nUsers) return rows;
        const n = goals[teamUID] - nUsers;

        for (let i=0; i<n; i++) {
            rows.push(
                <TableRow
                    key={i}
                >
                    <TableCell>
                        <Typography variant="body1" display="inline" noWrap={true}>
                            {'_'}
                        </Typography>
                    </TableCell>
                </TableRow>
            );
        }
        return rows;
    }


    render() {
        const { teams, goals } = this.state;

        return(
            <Box m={2}>
            <Grid container xs={12} spacing={2}>
            {teams &&
            Object.keys(teams).map(teamUID => {
                if (teamUID === 'unassigned') return;
                const team = teams[teamUID];
                return (
                    <Grid key={teamUID} item xs={6}>
                    <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>                                
                                    <Typography variant="body1">
                                            {`Team ${team.name}`}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {Object.keys(team.users).map(userUID => {
                            const user = team.users[userUID];
                            return (
                                <TableRow
                                    key={userUID}
                                >
                                    <TableCell>
                                        <Typography variant="body1" display="inline" noWrap={true}>
                                            {user.username}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )
                            }
                        )}
                        {this.getEmptyRows(teamUID)}
                        </TableBody>
                    </Table>
                    </TableContainer>
                    </Grid>
                )
            })
            }

            </Grid>
            </Box>
        )
    }
}

/*-------------------Export-------------------*/ 
export default compose(
    withFirebase,
    withSocket,
  )(TeamLeaderboard);