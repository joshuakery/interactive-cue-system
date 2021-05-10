import React from 'react';

import {
  Grid, Typography,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    currentCue: {
        fontWeight: 'bold',
        fontSize: '6em',
    },
    noteContainer: {
        minHeight: '15px',
    }
});

/**
 * Displays the current cue and its note
 * to the right of the main controls' buttons
 *
 */
const CurrentCueDisplay = (props) => {
  const { current_cue } = props;
  const classes = useStyles();
  return(
      <Grid item xs={12} container>
        <Grid item xs={12}>
            <Typography variant="body1" align="right">
                Current Cue
            </Typography>
        </Grid>
        <Grid item xs={12}>
            <Typography variant="h2" align="right" color="secondary" className={classes.currentCue}>
                {current_cue.number}
            </Typography>
        </Grid>
        <Grid item xs={12} className={classes.noteContainer}>
            <Typography variant="body1" align="right">
                {current_cue.note}
            </Typography>
        </Grid>
      </Grid>
  );
};
 
export default CurrentCueDisplay;