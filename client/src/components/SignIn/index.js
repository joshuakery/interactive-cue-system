import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
 
import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import {
  Button,
  TextField,
  Typography,
  Grid, Box,
} from '@material-ui/core';
 
const SignInPage = () => (
  <Grid container justify="center">
    <Grid item xs={12} sm={8} md={4} container spacing={2} justify="center">
      <Grid item xs={12}>
        <Box mb={4}>
          <Typography variant="h2" align="center">
            Welcome!
          </Typography>
          <Typography variant="h5" align="center">
            Please sign in.
          </Typography>
        </Box>
      </Grid>
      
      <SignInForm />
      <PasswordForgetLink />
      <SignUpLink />
    </Grid>
  </Grid>
  
);
 
const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};
 
class SignInFormBase extends Component {
  constructor(props) {
    super(props);
 
    this.state = { ...INITIAL_STATE };
  }
 
  onSubmit = event => {
    const { email, password } = this.state;
 
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
        this.setState({ error });
      });
 
    event.preventDefault();
  };
 
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
 
  render() {
    const { email, password, error } = this.state;
 
    const isInvalid = password === '' || email === '';
 
    return (
      <Grid item xs={12}>
        <form onSubmit={this.onSubmit}>
          <Grid container spacing={2} justify="center">
            <Grid item xs={12} container justify="center">
              <TextField
                id="outlined-basic"
                label="Email Address"
                variant="outlined"
                fullWidth={true}
                name="email"
                value={email}
                onChange={this.onChange}
                type="text"
              />
            </Grid>
            <Grid item xs={12} container justify="center">
              <TextField
                id="outlined-basic"
                label="Password"
                variant="outlined"
                fullWidth={true}
                name="password"
                value={password}
                onChange={this.onChange}
                type="password"
              />
            </Grid>
            <Grid item xs={12} container justify="center">
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
            <Grid item xs={12} container justify="center">
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
 
const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);
 
export default SignInPage;
 
export { SignInForm };