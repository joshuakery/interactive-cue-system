import React from 'react';
import _ from "lodash";

import {
    Button, Checkbox, FormControlLabel,
    TextField,
    Grid,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import theme from '../../../theme';
const useStyles = makeStyles(theme => ({
    submitChange: {
        [theme.breakpoints.down('md')]: {
            lineHeight: '1em',
        },
    },
}));

const IndividualTeamControls = props => {
    const {
        team,
        teamUID,
        originalTeams,
        onChangeTeamValue,
        onChangeTeamColor,
        submitTeamChanges,
    } = props;
    return (
    <Grid item xs={12} container spacing={2} justify="space-between">
        <Grid item xs={12} sm={9} md={6} container spacing={2} justify="flex-start">
            <Grid item xs={12} sm={4}>
                <TextField
                    id={"team-"+teamUID+"-name"}
                    label="Name"
                    variant="outlined"
                    name="name"
                    value={team.name}
                    onChange={(e) => onChangeTeamValue(e, teamUID)}
                    type="text"
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    id={"team-"+teamUID+"-primary"}
                    label="Primary Color"
                    variant="outlined"
                    name="primary"
                    value={team.colors.primary}
                    onChange={(e) => onChangeTeamColor(e, teamUID)}
                    type="text"
                />
            </Grid>
            {teamUID !== "unassigned" &&
            <Grid item xs={12} sm={4}>
                <FormControlLabel
                    control={
                    <Checkbox
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                        name="remove"
                        type="checkbox"
                        value={team.remove}
                        onChange={(e) => onChangeTeamValue(e, teamUID)}
                    />
                    }
                    label="Remove Team"
                />
            </Grid>
            }
        </Grid>
        <Grid item xs={12} sm={3} container justify="flex-end">
            <SubmitTeamChangesButton
                onClick={() => submitTeamChanges(teamUID)}
                disabled={_.isEqual(team,originalTeams[teamUID])}
            />
        </Grid>
    </Grid>
    );
}

const SubmitTeamChangesButton = (props) => {
    const { onClick, disabled } = props;
    const classes = useStyles(theme);
    return (
        <Button
            variant="contained"
            color="secondary"
            className={classes.submitChange}
            onClick={onClick}
            disabled={disabled}
        >
            SUBMIT TEAM CHANGES
        </Button>
    );
}

export default IndividualTeamControls;