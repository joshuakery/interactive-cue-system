import React from 'react';

import {
  Button
} from '@material-ui/core';

const PrevCueButton = (props) => {
  const { prevCue, onPrevCue, disabled } = props;
  return(
    <Button
      variant="contained"
      color="primary"
      onClick={onPrevCue}
      fullWidth={true}
      disabled={disabled}
    >
        {`PREV CUE ${prevCue ? prevCue.number : ''}`}
    </Button>
  );
};
 
export default PrevCueButton;