import React from 'react';
 
import { withFirebase } from '../Firebase';

import {
  Button, Box
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import theme from '../../theme';

const useStyles = makeStyles({
  signOutButtonNonAdminContainer: {
    backgroundColor: 'transparent',
  },
  signOutButtonNonAdmin: {
    color: 'white',
  }
});

const SignOutButton = ({ firebase }) => {
  return(
    <Button variant="contained" color="secondary" size="small" onClick={firebase.doSignOut}>
      SIGN OUT
    </Button>
  );
};

const SignOutButtonNonAdminBase = ({ firebase }) => {
  const classes = useStyles();
  return (
  <Box pt={2} pr={2} pb={4} align="right" className={classes.signOutButtonNonAdminContainer}>
    <Button size="small" className={classes.signOutButtonNonAdmin} onClick={firebase.doSignOut}>
      SIGN OUT
    </Button>
  </Box>
  );
}

export default withFirebase(SignOutButton);

const SignOutButtonNonAdmin = withFirebase(SignOutButtonNonAdminBase);

export { SignOutButtonNonAdmin };

