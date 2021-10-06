import React from 'react';

import NewTeamForm from './newTeam';
import TeamsTable from './teamsTable';
import ResetTeamsButton from '../reset/resetTeams';

import {
  Box,
} from '@material-ui/core';

const TeamsControls = () => (
    <Box mt={4} mb={4}>
        <TeamsTable />
        <NewTeamForm />
        <ResetTeamsButton />
    </Box>
);

export default TeamsControls;
