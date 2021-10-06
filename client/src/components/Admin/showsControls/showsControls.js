import React from 'react';

import NewShowForm from './newShow';
import SelectShow from './selectShow';
import EditCurrentShow from './editCurrentShow';

// import TeamsTable from './teamsTable';
// import ResetTeamsButton from '../reset/resetTeams';

import {
  Box,
} from '@material-ui/core';

const ShowsControls = (props) => (
    <Box mt={4} mb={4}>
        <SelectShow authUser={props.authUser} />
        <EditCurrentShow />
        <NewShowForm />
        {/* <TeamsTable />
        <NewTeamForm />
        <ResetTeamsButton /> */}
    </Box>
);

export default ShowsControls;
