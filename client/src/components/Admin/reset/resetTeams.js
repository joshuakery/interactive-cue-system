import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';

import ConfirmButton from './confirmButton';
import { resetTeams } from './utils';

class ResetTeamsButton extends Component {
    render() {
        return(
            <ConfirmButton
                buttonText="RESET TEAMS"
                confirmation="Delete all teams? (This will also reset the 'unassigned' team values.)"
                success="Teams reset!"
                action={(e) => resetTeams(this.props.firebase, this.props.showUID)}
            />
        );
    }
}

export default compose(
    withFirebase,
)(ResetTeamsButton);