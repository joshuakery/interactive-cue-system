import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';

import {
    Grid, Box,
    Typography,
    Button,
    TextField,
  } from '@material-ui/core';

const INITIAL_STATE = {
    name: '',
    primary: '',
    error: null,
  };

class NewTeamFormBase extends Component {
    constructor(props) {
      super(props);
   
      this.state = { ...INITIAL_STATE };
    }
   
    onSubmit = event => {
      event.preventDefault();
      const { name, primary } = this.state;
      const team = {
          name: name,
          colors: {
              primary: primary,
          },
      };
      this.props.firebase.teams().push(team);
      this.setState({
        name: '',
        primary: '',
      });
    };
   
    onChange = event => {
      this.setState({ [event.target.name]: event.target.value });
    };
   
    render() {
      const { name, primary, error } = this.state;
   
      const isInvalid = name === '' || primary === '';
   
      return (
        <Grid item xs={12} sm={4}>
          <Box mb={2}>
              <Typography variant="h5">
                  Create a New Team
              </Typography>
          </Box>
          <form onSubmit={this.onSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} container>
                <TextField
                  id="outlined-basic"
                  label="Team Name"
                  variant="outlined"
                  fullWidth={true}
                  name="name"
                  value={name}
                  onChange={this.onChange}
                  type="text"
                />
              </Grid>
              <Grid item xs={12} container justify="center">
                <TextField
                  id="outlined-basic"
                  label="Primary Color"
                  variant="outlined"
                  fullWidth={true}
                  name="primary"
                  value={primary}
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
                  CREATE TEAM
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

const NewTeamForm = compose(
    withFirebase,
  )(NewTeamFormBase);

  export default NewTeamForm;