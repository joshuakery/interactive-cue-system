import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
 
import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

import {
  Button,
  TextField,
  Typography,
  Grid, Box,
} from '@material-ui/core';
 
const SignInSignUpPage = () => (
  <Grid container justify="center">
    <Grid item xs={12} sm={8} md={4} container spacing={2} justify="center">
      <Grid item xs={12}>
        <Box mb={4}>
          <Typography variant="h2" align="center">
            Welcome to Packing and Cracking!
          </Typography>
          <Typography variant="h5" align="center">
            Please sign in.
          </Typography>
        </Box>
      </Grid>
      
      <SignInSignUpForm />
    </Grid>
  </Grid>
  
);
 
const INITIAL_STATE = {
  username: '',
  email: '',
  password: '',
  isAdmin: false,
  error: null,
};
 
class SignInSignUpFormBase extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
        ...INITIAL_STATE
    };
  }

  trySignUp = () => {
    const { email, username, password, isAdmin } = this.state;

    const roles = {};
    roles[ROLES.ADMIN] = isAdmin;

    this.props.firebase
    .doCreateUserWithEmailAndPassword(email, password)
    .then(authUser => {
      // Create a user in your Firebase realtime database
      this.props.firebase
        .user(authUser.user.uid)
        .set({
          username,
          email,
          roles,
      });

      return authUser;
    })
    .then(authUser => {
      this.props.firebase.doSetCustomClaims(authUser.user.uid);
      return authUser;
    })
    .then(authUser => {
      this.setState({ ...INITIAL_STATE });
      this.props.history.push(ROUTES.HOME);
    })
    .catch(error => {
      this.setState({ error });
    });

  }
 
  onSubmit = event => {
    const { email, username, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(authUser => {
        this.props.firebase.doSetCustomClaims(authUser.user.uid);
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        switch (error.code) {
            case 'auth/user-not-found':
              this.trySignUp();
              break;
            default:
              this.setState({ error });
              break;
          }
      });
 
    event.preventDefault();
  };
 
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  componentDidMount() {
      this.setState({ password:'test24' });
  }
 
  render() {
    const { email, username, password, error } = this.state;
 
    const isInvalid = password === '' || email === '';
 
    return (
      <Grid item xs={12}>
        <form onSubmit={this.onSubmit}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} container justifyContent="center">
              <TextField
                id="sign-in-email"
                label="Email Address"
                variant="outlined"
                fullWidth={true}
                name="email"
                value={email}
                onChange={this.onChange}
                type="text"
              />
            </Grid>
            <Grid item xs={12} container justifyContent="center">
                <TextField
                id="sign-in-username"
                label="Username"
                variant="outlined"
                fullWidth={true}
                name="username"
                value={username}
                onChange={this.onChange}
                type="text"
                />
            </Grid>
            
            <Grid item xs={12} container justifyContent="center">
              <TextField
                id="sign-in-password"
                label="Password"
                variant="outlined"
                fullWidth={true}
                name="password"
                value={password}
                onChange={this.onChange}
                type="password"
              />
            </Grid>
            <Grid item xs={12} container justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                size="large"
                fullWidth={true}
                disabled={isInvalid}
              >
                SIGN IN
              </Button>
            </Grid>
            <Grid item xs={12} container justifyContent="center">
              {error &&
              <Typography variante="body1">
                {error.message}
              </Typography>
              }
            </Grid>
          </Grid>
        </form>
      </Grid>
      
    );
  }
}
 
const SignInSignUpForm = compose(
  withRouter,
  withFirebase,
)(SignInSignUpFormBase);
 
export default SignInSignUpPage;
 
export { SignInSignUpForm };