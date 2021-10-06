import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';
import { resetCues, resetTeams, clearInput } from '../reset/utils';

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker
} from "@material-ui/pickers";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';


import {
    Grid, Box,
    Typography,
    Button,
    TextField,
  } from '@material-ui/core';

const INITIAL_STATE = {
    name: '',
    date: new Date(),
    time: new Date(),
    innings: 1,
    error: null,
  };

class NewShowFormBase extends Component {
    constructor(props) {
      super(props);
   
      this.state = { ...INITIAL_STATE };
    }
   
    onSubmit = event => {
      event.preventDefault();
      const { name, date, time, innings } = this.state;
      const show = {
          name: name,
          date: date.toString(),
          time: time.toString(),
          innings: innings,
      };
      const showRef = this.props.firebase.shows().push(show);
      const showUID = showRef.key;
      this.props.firebase.viewedShowID().set(showUID);
      this.setState({
        name: '',
        date: new Date(),
        time: new Date(),
        innings: 1,
      });
      //Set up other parts of the show
      resetCues(this.props.firebase, showUID);
      resetTeams(this.props.firebase, showUID);
      clearInput(this.props.firebase, showUID);
    };
   
    onChange = event => {
      this.setState({ [event.target.name]: event.target.value });
    };

    handleDateChange = date => {
      this.setState({ date:date });
    }

    handleTimeChange = time => {
      this.setState({ time:time });
    }
   
    render() {
      const { name, date, time, innings, error } = this.state;
   
      const isInvalid = name === '' || innings <= 0;
   
      return (
        <Grid item xs={12} sm={4}>
          <Box mb={2}>
              <Typography variant="h5">
                  Create a New Show
              </Typography>
          </Box>
          <form onSubmit={this.onSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} container>
                <TextField
                  id="create-show-name"
                  label="Show Name"
                  variant="outlined"
                  fullWidth={true}
                  name="name"
                  value={name}
                  onChange={this.onChange}
                  type="text"
                />
              </Grid>
              <Grid item xs={12} container>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    placeholder="2021/10/10"
                    value={date}
                    onChange={date => this.handleDateChange(date)}
                    format="yyyy/MM/dd"
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={12} container>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardTimePicker
                    label="Start Time"
                    placeholder="010:00 AM"
                    mask="__:__ _M"
                    value={time}
                    onChange={time => this.handleTimeChange(time)}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={12} container>
                <TextField
                    id="create-show-games-number"
                    label="Number of Games"
                    variant="outlined"
                    fullWidth={true}
                    name="innings"
                    value={innings}
                    onChange={this.onChange}
                    type="number"
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
                  CREATE SHOW
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

const NewShowForm = compose(
    withFirebase,
  )(NewShowFormBase);

  export default NewShowForm;