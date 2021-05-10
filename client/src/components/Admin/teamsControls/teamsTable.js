import React, { Component} from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';
import _ from "lodash";

import IndividualTeamTable from './individualTeamTable';
import IndividualTeamControls from './individualTeamControls';

import {
    Button,
    Typography,
    Box, Grid,
    Accordion, AccordionSummary, AccordionDetails,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class TeamsTable extends Component {
    constructor(props) {
        super(props);
     
        this.state = {
          loading: true,
          teams: {},
          /* originalTeams keeps track of changes to teams, to disable/enable buttons when there is a change */
          originalTeams: {},
        };
    }

    componentDidMount() {
        this.setState({ loading: true });

        /**
         * sets up teams object containing team objects each with users lists
         * 
         * builds the unassigned team from users without a team
         * so that in firebase, users can have no team value
         * instead of needing a default 'unassigned' value
         *
         */
        this.props.firebase.teams().on('value', async (snapshot) => {
            const teams = snapshot.val();

            /* set up teams object */
            Object.keys(teams).forEach(teamUID => {
                teams[teamUID].users = {};
                teams[teamUID].remove = false;
            });

            /* sort users into teams object */
            await this.props.firebase.users().once('value', snapshot => {
                const users = snapshot.val();

                Object.keys(users).forEach(userUID => {
                    const user = users[userUID];
                    if (!user.team) {
                        teams.unassigned.users[userUID] = user;
                    } else {
                        teams[user.team].users[userUID] = user;
                    }
                });
    
            });

            this.setState({
                loading: false,
                teams: teams,
                originalTeams: _.cloneDeep(teams),
            });
        });
    }
    
    componentWillUnmount() {
        this.props.firebase.teams().off();
    }
     
    handleTeamChange = (event, user) => {
        event.preventDefault();
        const { teams } = this.state;
        const newTeam = event.target.value;
        //mark the user as having a new team
        user.team = newTeam;     
        //save state
        this.setState({
          teams: teams,
        });
    }

    /**
     * special onChange function sets the team color in state
     * because color is stored as a {colors} object
     *
     */
    onChangeTeamColor = (event, teamUID) => {
        event.preventDefault();
        const { teams } = this.state;
        const team = teams[teamUID];
        const name = event.target.name;
        const value = event.target.value;
        team.colors[name] = value;
        this.setState({
            teams: teams,
        });
    };

    /**
     * default onChange function
     *
     */
    onChangeTeamValue = (event, teamUID) => {
        event.preventDefault();
        const { teams } = this.state;
        const team = teams[teamUID];
        const name = event.target.name;
        const value = event.target.value;
        team[name] = value;
        this.setState({
            teams: teams,
        });
    }

    /**
     * Helper function that moves a user from one team to another
     * saving their team value in firebase
     * and changing originalTeams in state to reflect that change
     *
     */
    updateUserTeam = (userUID,oldTeamUID) => {
        const { teams, originalTeams } = this.state;
        const oldTeam = teams[oldTeamUID];
        const user = oldTeam.users[userUID];
        //do nothing if there will be no change
        if (!user.team || oldTeamUID == user.team) return;
        //remove user from old team
        delete oldTeam.users[userUID];
        //add user to new team
        const newTeam = teams[user.team];
        newTeam.users[userUID] = user;
        //update firebase - we've already changed the team property on the user in handleTeamChange
        this.props.firebase.user(userUID).update(user);
        //set original teams so we can disable buttons
        originalTeams[oldTeamUID].users = _.cloneDeep(teams[oldTeamUID].users);
        originalTeams[user.team].users = _.cloneDeep(teams[user.team].users);
        this.setState({
            originalTeams: originalTeams,
        });
    }

    /**
     * like updateTeam, updates user's teams to be unassigned in the state
     * and removes the team from the state and firebase
     *
     */
    removeTeam = teamUID => {
        if (teamUID == "unassigned") return; //failsafe; should not happen ever
        const { teams, originalTeams } = this.state;
        const team = teams[teamUID];
        Object.keys(team.users).forEach(userUID => {
            const user = team.users[userUID];
            //add user to unassigned
            teams.unassigned.users[userUID] = user;
            //update user in firebase
            user.team = "unassigned";
            this.props.firebase.user(userUID).update(user);
        });
        delete teams[teamUID];
        this.props.firebase.team(teamUID).set(null);
        //since we might have unsaved changes to other teams elsewhere, only update this team in originalTeams
        delete originalTeams[teamUID];
        this.setState({
            teams: teams,
            originalTeams: originalTeams,
        });
    }

    /**
     * Submits all changes to one team's users and metadata
     * Or sets a team to be removed
     *
     */
    updateTeam = (teamUID, team) => {
        if (team.remove) {
            this.removeTeam(teamUID);
        } else {
            //update all users
            Object.keys(team.users).forEach(userUID => {
                this.updateUserTeam(userUID,teamUID);
            });
            //update metadata in firebase
            //exclude users property because this information is stored on each user
            const teamData = {
                name: team.name,
                colors: team.colors,
            }
            this.props.firebase.team(teamUID).update(teamData);
            //set original teams so we can disable buttons
            const { originalTeams } = this.state;
            originalTeams[teamUID] = _.cloneDeep(team);
            this.setState({
                originalTeams: originalTeams,
            });
        }
    }

    /**
     * Submits the change for only one user on one team
     *
     */
    submitTeamChange = (event, userUID, oldTeamUID) => {
        event.preventDefault();
        this.updateUserTeam(userUID,oldTeamUID);
    }

    /**
     * Submits all changes to one team's users and metadata
     * to make multiple changes easy to submit at once
     *
     */
    submitTeamChanges = teamUID => {
        const { teams } = this.state;
        const team = teams[teamUID];
        this.updateTeam(teamUID, team);
    }

    /**
     * Submits all changes to all teams' users and metadata
     * to make it easy to submit all changes at once
     *
     */
    submitAllTeamsChanges = event => {
        event.preventDefault();
        const { teams } = this.state;
        Object.keys(teams).forEach(teamUID => {
            const team = teams[teamUID];
            this.updateTeam(teamUID, team);
        });
    }

    /**
     * Returns a dynamic style for each team's Accordion element
     * to give some feedback about the color choice
     * and to make it easier to visually distinguish the Accordion choices
     *
     */
    getAccordionStyle = (color) => {
        return {
            'border': '5px solid ' + color,
            'color': color,
        };
    }

    render() {
        const { loading, teams, originalTeams } = this.state;
        return (
            <form onSubmit={(e) => this.submitAllTeamsChanges(e)}>
            <Box mt={4} mb={6}>

                <Box mb={2}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography variant="h4">
                            Teams
                        </Typography>
                    </Grid>
                    <Grid item xs={6} container justify="flex-end">
                        <Button
                            variant="contained"
                            color="secondary"
                            type="submit"
                            onClick={(e) => this.submitAllTeamsChanges(e)}
                            disabled={_.isEqual(teams,originalTeams)}
                        >
                            SUBMIT ALL TEAM CHANGES
                        </Button>
                    </Grid>
                </Grid>
                </Box>

                {loading && <div>Loading ...</div>}

                {Object.keys(teams).map(teamUID => {
                    const team = teams[teamUID];
                    return (
                        <Accordion key={teamUID} style={team.colors && this.getAccordionStyle(team.colors.primary)}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                            >
                                <Typography variant="h5">
                                    Team: {team.name}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={4}>
                                    <IndividualTeamControls
                                        teamUID={teamUID}
                                        team={team}
                                        originalTeams={originalTeams}
                                        onChangeTeamValue={this.onChangeTeamValue}
                                        onChangeTeamColor={this.onChangeTeamColor}
                                        submitTeamChanges={this.submitTeamChanges}
                                    />
                                    <IndividualTeamTable
                                        teamUID={teamUID}
                                        teams={teams}
                                        handleTeamChange={this.handleTeamChange}
                                        submitTeamChange={this.submitTeamChange}
                                    />
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    );
                })}
                
            </Box>
            </form>
        );
    }

};

export default compose(
    withFirebase,
  )(TeamsTable);