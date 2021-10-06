import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { withSocket } from '../Socket';
import { compose } from 'recompose';

import {
    Box,
    Grid, Typography,
    Button,
    TextField, InputAdornment,
  } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    textInput: {
        background: 'white',
    }
});

const QuizInput = props => {
    const { value, onChange, onSubmit } = props;
    const classes = useStyles();
    return(
        <Grid container justifyContent="center">
            <Grid item xs={4} container spacing={1}>
                <Grid item xs={12}>
                    <TextField
                        id="quiz-question-input"
                        label="Answer"
                        variant="filled"
                        className={classes.textInput}
                        fullWidth={true}
                        name="quiz-question-input"
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e)}
                    />                              
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth={true}
                        size="large"
                        onClick={(e) => onSubmit(e)}
                    >
                        SUBMIT
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
}

class QuizQuestion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
        }
    }

    onChange = event => {
        const value = event.target.value;
        this.setState({ value:value });
    }

    onSubmit = event => {
        event.preventDefault();
        const { value } = this.state;
        const { showUID, inputID, teamUID, userUID } = this.props.ids;

        this.props.firebase
        .individualUserInput(showUID,inputID,teamUID,userUID)
        .set(value);

        this.setState({ value:'' });
    }

    render() {
        const { value } = this.state;
        return(
            <Box mt={4} mb={2}>
                <QuizInput value={value} onChange={this.onChange} onSubmit={this.onSubmit} />
            </Box>
            
        )
    }
}

/*-------------------Export-------------------*/ 
export default compose(
    withFirebase,
    withSocket,
  )(QuizQuestion);