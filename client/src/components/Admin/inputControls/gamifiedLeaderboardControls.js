import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';
import _ from "lodash";

import {
    Box, Grid, Typography,
    Button,
    Accordion, AccordionSummary, AccordionDetails,
    TextField,
} from '@material-ui/core';



class GamifiedLeaderboardControls extends Component {
    constructor(props) {
        super(props);

        this.state = {
            teams: {},
            goals: {},
            originalGoals: {},
        }
    }

    setupListeners = () => {
        const { showUID, inputID } = this.props.ids;

        this.props.firebase
        .teams(showUID)
        .on('value',snapshot => {
            const teams = snapshot.val();
            this.setState({ teams:teams });
        });

        this.props.firebase
        .showWideInput(showUID,inputID)
        .on('value',snapshot => {
            const goals = snapshot.val() ? snapshot.val() : {};
            this.setState({
                goals:goals,
                originalGoals:_.cloneDeep(goals),
            });
        });
    }

    componentDidMount() {
        this.setupListeners();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.ids !== this.props.ids) {
            //turn off existing listeners
            const { showUID, inputID } = prevProps.ids;
            this.props.firebase.teams(showUID).off();
            this.props.firebase.showWideInput(showUID,inputID).off();
            //new listeners
            this.setupListeners();
        }
    }

    componentWillUnmount() {
        const { showUID, inputID } = this.props.ids;
        this.props.firebase.teams(showUID).off();
        this.props.firebase.showWideInput(showUID,inputID).off();
    }

    onChange = (event,teamUID) => {
        event.preventDefault();
        const { goals } = this.state;
        goals[teamUID] = event.target.value;
        this.setState({ goals:goals });
    }

    onSubmit = () => {
        const { showUID, inputID } = this.props.ids;
        const { goals } = this.state;
        this.props.firebase
        .showWideInput(showUID,inputID)
        .set(goals);
    }

    render() {
        const { showUID } = this.props;
        const { teams, goals, originalGoals } = this.state;
        return(
            <div>
                <Box mt={4} mb={4}>
                    <Typography variant="h5">{`Gamified Leaderboard Entry`}</Typography>
                    <Grid container spacing={1}>
                        {Object.keys(teams).map(teamUID => {
                            if (teamUID === "unassigned") return;
                            const team = teams[teamUID];
                            return (
                                <Grid item xs={6}>
                                    <TextField
                                        id={`team-${teamUID}-goal`}
                                        variant="outlined"
                                        label={`${team.name} Team Goal`}
                                        size="small"
                                        name="goal"
                                        type="number"
                                        value={goals[teamUID] ? goals[teamUID] : ''}
                                        onChange={(e) => this.onChange(e,teamUID)}
                                    /> 
                                </Grid>
                            );
                        })}
                    </Grid>
                    <SubmitChangeButton onClick={this.onSubmit} disabled={_.isEqual(goals,originalGoals)} />
                </Box>
            </div>
        );
    }
}

const SubmitChangeButton = (props) => {
    const { onClick, disabled } = props;
    // const classes = useStyles(theme);
    return (
        <Button
            variant="contained"
            color="secondary"
            // className={classes.submitChange}
            onClick={onClick}
            disabled={disabled}
        >
            SUBMIT CHANGES
        </Button>
    );
}

export default compose(
    withFirebase,
  )(GamifiedLeaderboardControls);