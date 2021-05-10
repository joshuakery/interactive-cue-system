import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';

import {
    Grid, Box,
    Typography,
    Button,
    TextField,
  } from '@material-ui/core';

class CreateCueForm extends Component {
    constructor(props) {
      super(props);
   
      this.state = {
        createCue: {
            number: '',
            note: '',
        }
      };
    }

    onCreateCue = (event) => {
        event.preventDefault();
        if (this.state.createCue.number == '') return;
        this.props.firebase.cues()
        .push(this.state.createCue);
        this.setState({
            createCue: {
                number: '',
                note: '',
            }
        })
    }
   
    onCreateCueChange = event => {
        const name = event.target.name;
        const value = event.target.value;

        const newCue = this.state.createCue;
        newCue[name] = value;
        if (name == "number" && value != '') newCue[name] = parseInt(value);
        this.setState({
            createCue: newCue,
        });
    }
   
    render() {
      return (
        <Box mt={4}>
            <Box mb={2}>
                <Typography variant="h5">
                    Create a New Cue
                </Typography>
            </Box>
            <form onSubmit={(e) => this.onCreateCue(e)}>
                <Grid container spacing={1} item xs={12} sm={4}>
                    <Grid item xs={12}>
                        <TextField
                            id="outlined-basic"
                            variant="outlined"
                            label="NUMBER"
                            fullWidth={true}
                            size="small"
                            name="number"
                            type="number"
                            value={this.state.createCue.number}
                            onChange={(e) => this.onCreateCueChange(e)}
                        /> 
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="outlined-basic"
                            variant="outlined"
                            label="NOTE"
                            fullWidth={true}
                            size="small"
                            name="note"
                            type="text"
                            value={this.state.createCue.note}
                            onChange={(e) => this.onCreateCueChange(e)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="secondary"
                            fullWidth={true}
                            type="submit"
                        >
                            CREATE CUE
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
      );
    }
  }

export default compose(
    withFirebase,
)(CreateCueForm);