import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
 
import AuthUserContext from './context';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
 
/**
 * authorization means a user (who has already been authenticated)
 * is allowed to see this page
 * 
 * withAuthorization subscribes to changes to the authenticated user as a Context Consumer
 * in order to look at the authenticated user info to check if the user should be authorized or not
 * 
 * @param {function} condition returns true if the user is allowed to see this page
 * e.g. an admin can see the admin page, but a non-admin user cannot 
 *
 */
const withAuthorization = condition => Component => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      this.listener = this.props.firebase.onAuthUserListener(
        /* "next" function reroutes if user is not authorized */
        authUser => {
          if (!condition(authUser)) {
            /* note: do not send to SIGN_IN page with current styling */
            /* the NavigationAuthNonAdmin is hard to see on the sign in page */
            this.props.history.push(ROUTES.LANDING);
          }
        },
        /* "fallback" function reroutes if authUser does not exist i.e. user is not authenticated */
        () => this.props.history.push(ROUTES.LANDING),
      );
    }
 
    componentWillUnmount() {
      this.listener();
    }
 
    render() {
      /* to hide the Component from non-authorized users, does not pass it unless authUser passes the condition */
      return (
        <AuthUserContext.Consumer>
          {authUser =>
            condition(authUser) ? <Component {...this.props} authUser={authUser}/> : null
          }
        </AuthUserContext.Consumer>
      );
    }
  }
 
  return compose(
    withRouter,
    withFirebase,
  )(WithAuthorization);
};
 
export default withAuthorization;