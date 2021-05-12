import React from 'react';

import {
    Button,
    RadioGroup, FormControlLabel, Radio,
    Typography,
    Grid,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper,
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

const IndividualTeamTable = (props) => {
    const { teamUID, teams, handleTeamChange, submitTeamChange } = props;
    return (
    <Grid item xs={12} container spacing={2}>
        <TableContainer component={Paper}>
            <Table>
                <TeamTableHead />
                <TeamTableBody
                    teamUID={teamUID}
                    teams={teams}
                    handleTeamChange={handleTeamChange}
                    submitTeamChange={submitTeamChange}
                />
            </Table>
        </TableContainer> 
    </Grid>   
    );
}

const TeamTableHead = () => (
    <TableHead>
        <TableRow>
            <TableCell>                                
                <Typography variant="body1">
                        UID
                </Typography>
            </TableCell>
            <TableCell>
                <Typography variant="body1">
                        NAME
                </Typography>
            </TableCell>
            <TableCell>
                <Typography variant="body1">
                        SWITCH TEAM
                </Typography>
            </TableCell>
            <TableCell></TableCell>
        </TableRow>
    </TableHead>
);

const SubmitChangeButton = (props) => {
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
            SUBMIT CHANGE
        </Button>
    );
}

const TeamSwitch = (props) => {
    const { teams, user, handleTeamChange } = props;
    return (
        <RadioGroup
            row
            aria-label="Switch Team"
            name="switch-team"
            value={user.team ? user.team : "unassigned"}
            onChange={(e) => handleTeamChange(e, user)}
        >
            {Object.keys(teams).map(teamUID => (
                <FormControlLabel
                    key={teamUID}
                    value={teamUID}
                    control={<Radio />}
                    label={teams[teamUID].name}
                />
            ))}
        </RadioGroup>
    );
}

const TeamTableBody = (props) => { 
    const { teamUID, teams, handleTeamChange, submitTeamChange } = props;
    const team = teams[teamUID];
    const users = team.users;
    return (
        <TableBody>
            {Object.keys(users).map(userUID => {
                const user = users[userUID];
                return (
                    
                    <TableRow key={userUID}>
                        <TableCell>                                
                            <Typography variant="body1">
                                    {userUID}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="body1">
                                    {user.username}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <TeamSwitch
                                teams={teams}
                                user={user}
                                userUID={userUID}
                                handleTeamChange={handleTeamChange}
                            />
                        </TableCell>
                        <TableCell align="right">
                            <SubmitChangeButton
                                onClick={(e) => submitTeamChange(e, userUID, teamUID)}
                                disabled={user.team === teamUID || (!user.team && teamUID === "unassigned")}
                            />
                        </TableCell>
                    </TableRow>
                    
                );
            })}
        </TableBody>
    );
}

export default IndividualTeamTable;