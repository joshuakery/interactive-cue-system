import React from 'react';

import {
  Button
} from '@material-ui/core';

const PrevCueButton = (props) => {
  const { prevCue, onPrevCue } = props;
  return(
    <Button variant="contained" color="primary" onClick={onPrevCue} fullWidth={true}>
        PREV CUE: {prevCue && prevCue.number}
    </Button>
  );
};
 
export default PrevCueButton;