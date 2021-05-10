import React, { Component } from 'react';
import { Link } from 'react-router-dom';
 
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import {
  Button,
  TextField,
  Typography,
  Grid, Box,
} from '@material-ui/core';
 
const PasswordForgetPage = () => (
  <Grid container justify="center">
    <Grid item xs={12} sm={8} md={4} container spacing={2} justify="center">
      <Grid item xs={12}>
        <Box mb={4}>
          <Typography variant="h4" align="center">
            Forgot Your Password?
          </Typography>
        </Box>
      </Grid>
      
      <PasswordForgetForm />
    </Grid>
  </Grid>
);
 
const INITIAL_STATE = {
  email: '',
  error: null,
};
 
class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);
 
    this.state = { resetLinkSent: false, ...INITIAL_STATE };
  }
 
  onSubmit = event => {
    const { email } = this.state;
 
    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({ resetLinkSent: true, ...INITIAL_STATE });
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
    const { email, error, resetLinkSent } = this.state;
 
    const isInvalid = email === '';
 
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
                value={this.state.email}
                onChange={this.onChange}
                type="text"
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
                RESET MY PASSWORD
              </Button>
            </Grid>
            <Grid item xs={12} container justify="center">
              {resetLinkSent &&
              <Typography variante="body1" color="secondary">
                A reset link has been sent to your email.
              </Typography>
              }
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
 
const PasswordForgetLink = () => (
  <Button
    size="small"
    component={Link}
    to={ROUTES.PASSWORD_FORGET}
  >
    FORGOT PASSWORD?
  </Button>
);
 
export default PasswordForgetPage;
 
const PasswordForgetForm = withFirebase(PasswordForgetFormBase);
 
export { PasswordForgetForm, PasswordForgetLink };