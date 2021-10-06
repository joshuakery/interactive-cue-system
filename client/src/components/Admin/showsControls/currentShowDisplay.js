import React from 'react';

import {
  Grid, Typography,
} from '@material-ui/core';

/**
 * Displays the current show and its date
 *
 */
const CurrentShowDisplay = (props) => {
  const { current_show } = props;
  return(
      <Grid item xs={12} container>
        <Grid item xs={12}>
            <Typography variant="body1">
                Current Show
            </Typography>
        </Grid>
        <Grid item xs={12}>
            <Typography variant="h2" color="secondary" >
                {current_show.name}
            </Typography>
        </Grid>
      </Grid>
  );
};
 
export default CurrentShowDisplay;