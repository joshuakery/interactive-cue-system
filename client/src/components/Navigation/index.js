import React from 'react';
import { Link } from 'react-router-dom';
 
import { AuthUserContext } from '../Session';
import SignOutButton, { SignOutButtonNonAdmin } from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

import {
  AppBar, Toolbar, Tabs, Tab,
  Box,
  Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  /* so the non-admin navigation appears subtly over the audience UI */
  navigateAuthNonAdmin: {
    height: '0',
    backgroundColor: 'rgba(0,0,0,0)',
  },
});

/* NOTE: still showing the admin UI when an admin switches another user to & from admin status */
/* a refresh fixes this */

const Navigation = (props) => (
  <div>
    <AuthUserContext.Consumer>
      {authUser => {
        if (authUser) {
          if (!!authUser.roles[ROLES.ADMIN] && !!authUser.claims.admin) {
            return (
              <NavigationAuth authUser={authUser} history={props.history}/>
            );
          } else {
            return (
              <NavigationAuthNonAdmin />
            );
          }

        } else {

          return (
            <NavigationNonAuth />
          );

        }
      }
      }
    </AuthUserContext.Consumer>
  </div>
);

/**
 * Creates the navigation component for admin users
 * so that it can be styled independently of the audience UI
 * 
 */
const NavigationAuth = (props) => {
  const { authUser, history } = props;
  return (
  <AppBar position="static">
    <Toolbar>
      <Tabs
        value={ history.location.pathname }
      >
        {(!!authUser.roles[ROLES.ADMIN] && !!authUser.claims.admin) && ( 
          <Tab
            label="ADMIN"
            value={ROUTES.ADMIN}
            component={ Link }
            to={ROUTES.ADMIN}
          />
        )}
        {(!!authUser.roles[ROLES.ADMIN] && !!authUser.claims.admin) && ( 
          <Tab
            label="HOME"
            value={ROUTES.HOME}
            component={ Link }
            to={ROUTES.HOME}
          />
        )}
        {(!!authUser.roles[ROLES.ADMIN] && !!authUser.claims.admin) && ( 
          <Tab
            label="PARTY"
            value={ROUTES.PARTY}
            component={ Link }
            to={ROUTES.PARTY}
          />
        )}
        
      </Tabs>
      <SignOutButton />
    </Toolbar>

  </AppBar>
  );
}

/**
 * Creates a component for non-admin users to sign out
 * so that it can be styled independently of the admin UI
 * 
 */
const NavigationAuthNonAdmin = () => {
  const classes = useStyles();
  return (
  <Box className={classes.navigateAuthNonAdmin}>
    <SignOutButtonNonAdmin />
  </Box>
  );
};
 
/**
 * Creates a component for non-admin users to sign in
 * so that it can be styled independently of the admin UI
 * 
 */
const NavigationNonAuth = () => (
  <Box mt={2} ml={2} mb={4}>
    <Button
      size="small"
      component={Link}
      to={ROUTES.SIGN_IN_SIGN_UP}
    >
      SIGN IN
    </Button>
  </Box>
);
 
export default Navigation;