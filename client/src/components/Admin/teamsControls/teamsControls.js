import React, { Component }  from 'react';

import TeamPoints from './teamPoints';
import NewTeamForm from './newTeam';
import TeamsTable from './teamsTable';
import ResetTeamsButton from '../reset/resetTeams';

import {
  Box,
} from '@material-ui/core';

class TeamsControls extends Component {
  constructor(props) {
      super(props);
  }

  render() {
    const { showUID } = this.props;
    return(
      <Box mt={4} mb={4}>
        <TeamsTable showUID={showUID} />
        <TeamPoints showUID={showUID} />
        <NewTeamForm showUID={showUID} />
        <ResetTeamsButton showUID={showUID} />
      </Box>
    )
  }
}

export default TeamsControls;
