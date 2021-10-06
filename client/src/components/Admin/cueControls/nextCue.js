import React from 'react';

import {
  Button
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    nextButton: {
        minHeight: '70px',
    }
});

const NextCueButton = (props) => {
  const { nextCue, onNextCue } = props;
  const classes = useStyles();
  return(
    <Button variant="contained" color="secondary" onClick={onNextCue} fullWidth={true} size="large" className={classes.nextButton}>
        NEXT CUE: {nextCue && nextCue.number}
    </Button>
  );
};
 
export default NextCueButton;