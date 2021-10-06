import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { withSocket } from '../Socket';
import { compose } from 'recompose';

import ForegroundBackgroundCanvas from './foregroundBackgroundCanvas';

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


class DrawingBattleInput extends Component {
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

    onSubmit = () => {
        const { ids, bracketID } = this.props;
        this.props.firebase.showWideInput(ids.showUID,bracketID)
        .once('value', snapshot => {
            if (!snapshot.exists()) {
                console.log('no bracket');
            } else {
                
            }
        })
    }

    render() {
        const { ids } = this.props;
        const { value } = this.state;
        return(
            <Box mt={4} mb={2}>
                <ForegroundBackgroundCanvas ids={ids} key={ids.inputID} />
                <Box mt={6}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.onSubmit}
                    >
                        SUBMIT
                    </Button>
                </Box>
            </Box>
            
        )
    }
}

/*-------------------Export-------------------*/ 
export default compose(
    withFirebase,
    withSocket,
  )(DrawingBattleInput);