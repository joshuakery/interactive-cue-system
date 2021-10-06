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

class QuizAnswers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            teams: {},
            answers: {},
        }
    }

    componentDidMount() {
        const { showUID, inputID } = this.props;
        this.props.firebase
        .teams(showUID)
        .on('value',snapshot => {
            const teams = snapshot.val();
            this.setState({ teams:teams });
        });
        this.props.firebase
        .showWideInput(showUID,inputID)
        .on('value', snapshot => {
            const answers = snapshot.val();
            this.setState({ answers:answers });
        });
    }

    componentWillUnmount() {
        const { showUID, inputID } = this.props;
        this.props.firebase
        .teams(showUID)
        .off();
        this.props.firebase
        .showWideInput(showUID,inputID)
        .off();
    }


    render() {
        const { answers, teams } = this.state;
        return(
            <Box m={2}>
            <Grid container spacing={2}>
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
                        {answers && answers[teamUID] &&
                        Object.keys(answers[teamUID]).map(userUID => {
                            const answer = answers[teamUID][userUID];
                            return (
                                <TableRow
                                    key={userUID}
                                >
                                    <TableCell>
                                        <Typography variant="body1" display="inline" noWrap={true}>
                                            {answer}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )
                            }
                        )}
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
  )(QuizAnswers);