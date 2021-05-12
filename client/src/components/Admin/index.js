import React, { Component } from 'react';
import { compose } from 'recompose';
 
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';

import CueControls from './cueControls/cueControls';
import UsersControls from './usersControls';
import TeamsControls from './teamsControls/teamsControls';
import InputControls from './inputControls/inputControls';

import {
  Box,
  Divider,
} from '@material-ui/core';

 
class AdminPage extends Component {
  render() {

    return (
      <div>
        <Box m={2} maxWidth="1000px" margin="auto">
          <CueControls />
          <Divider />
          <UsersControls authUser={this.props.authUser} />
          <Divider />
          <TeamsControls authUser={this.props.authUser} />
          <Divider />
          <InputControls />
        </Box>
      </div>
    );
  }

}
 
/*-------------------Export-------------------*/
const condition = authUser => {
  /* custom claims take a full sign in and sign out to take effect */
  /* ideally by keeping track of the roles in the db, we can hide this page without worrying about that */
  /* however, even if a non-admin user could see this page, their changes wouldn't work */
  /* because they would still have had their admin status in their custom claims revoked */
  return (authUser && !!authUser.roles[ROLES.ADMIN] && !!authUser.claims.admin);
}
  

export default compose(
  withAuthorization(condition),
  withFirebase,
)(AdminPage);