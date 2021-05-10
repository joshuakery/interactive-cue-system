import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { withAuthorization } from '../Session';
 
class LandingPage extends Component {
  render() {
    return (
      <div>
          <h1>Landing Page</h1>
      </div>
    );
  }
}
 
/*-------------------Export-------------------*/
const condition = authUser => !!authUser;
 
export default compose(
  withAuthorization(condition),
  withFirebase,
)(LandingPage);