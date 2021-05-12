import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';

import ConfirmButton from './confirmButton';

class ResetTeamsButton extends Component {
    removeUsersTeams = () => {
        this.props.firebase.users().once('value', snapshot => {
            const users = snapshot.val();
            Object.keys(users).forEach(userUID => {
                const user = users[userUID];
                delete user.team;
            });
            this.props.firebase.users().set(users);
        });
    }

    resetTeams = () => {
        //all users must be removed from their teams
        this.removeUsersTeams();
        //and teams should be replaced with one team, unassigned
        const teams = {
            unassigned: {
                name: "Unassigned",
                colors: {
                    primary: 'black',
                },
            }
        };
        this.props.firebase.teams().set(teams);
    }

    render() {
        return(
            <ConfirmButton
                buttonText="RESET TEAMS"
                confirmation="Delete all teams? (This will also reset the 'unassigned' team values.)"
                success="Teams reset!"
                action={this.resetTeams}
            />
        );
    }
}

export default compose(
    withFirebase,
)(ResetTeamsButton);