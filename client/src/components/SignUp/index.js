import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
 
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

import {
  Button,
  TextField,
  Typography,
  Grid, Box,
} from '@material-ui/core';
 
const SignUpPage = () => (
  <Grid container justify="center">
  <Grid item xs={12} sm={8} md={4} container spacing={2} justify="center">
    <Grid item xs={12}>
      <Box mb={4}>
        <Typography variant="h4" align="center">
          Create a New Account
        </Typography>
      </Box>
    </Grid>
    
    <SignUpForm />
  </Grid>
</Grid>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  isAdmin: false,
  error: null,
};
 
class SignUpFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
 
  onSubmit = event => {
    const { username, email, passwordOne, isAdmin } = this.state;
    const roles = {};

    roles[ROLES.ADMIN] = isAdmin;
 
    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
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
 
    event.preventDefault();
  };
 
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onChangeCheckbox = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };
 
  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      isAdmin,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';

    return (
      <Grid item xs={12}>
        <form onSubmit={this.onSubmit}>
          <Grid container spacing={2} justify="center">
            <Grid item xs={12} container justify="center">
              <TextField
                id="outlined-basic"
                label="Username"
                variant="outlined"
                fullWidth={true}
                name="username"
                value={username}
                onChange={this.onChange}
                type="text"
              />
            </Grid>
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
                name="passwordOne"
                value={passwordOne}
                onChange={this.onChange}
                type="password"
              />
            </Grid>
            <Grid item xs={12} container justify="center">
              <TextField
                id="outlined-basic"
                label="Confirm Password"
                variant="outlined"
                fullWidth={true}
                name="passwordTwo"
                value={passwordTwo}
                onChange={this.onChange}
                type="password"
              />
            </Grid>
            {/* <label>
              Admin:
              <input
                name="isAdmin"
                type="checkbox"
                checked={isAdmin}
                onChange={this.onChangeCheckbox}
              />
            </label> */}
            <Grid item xs={12} container justify="center">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                size="large"
                fullWidth={true}
                disabled={isInvalid}
              >
                SIGN UP
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
 
const SignUpLink = () => (
  <Grid item xs={12} container justify="center">
    <Box mt={4}>
      <Grid item xs={12} container justify="center">
        <Typography variant="body1">
          Don't have an account?
        </Typography>
      </Grid>
      <Grid item xs={12} container justify="center">
        <Button
          size="small"
          component={Link}
          to={ROUTES.SIGN_UP}
        >
          SIGN UP
        </Button>
      </Grid>
    </Box>
  </Grid>
);

const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);
 
export default SignUpPage;
 
export { SignUpForm, SignUpLink };