import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import clsx from 'clsx';

import P5CanvasAlwaysDrawing from './p5canvasAlwaysDrawing';

import {
    Grid, Box,
    Button, RadioGroup, FormControlLabel, Radio,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
        '&:hover': {
          backgroundColor: 'transparent',
        },
      },
    icon: {
        borderRadius: '50%',
        width: 16,
        height: 16,
        boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
        backgroundColor: '#f5f8fa',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
        '$root.Mui-focusVisible &': {
          outline: '2px auto rgba(19,124,189,.6)',
          outlineOffset: 2,
        },
        'input:hover ~ &': {
          backgroundColor: '#ebf1f5',
        },
        'input:disabled ~ &': {
          boxShadow: 'none',
          background: 'rgba(206,217,224,.5)',
        },
      },
    checkedIcon: {
        backgroundColor: '#137cbd',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
        '&:before': {
          display: 'block',
          width: 16,
          height: 16,
          backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
          content: '""',
        },
        'input:hover ~ &': {
          backgroundColor: '#106ba3',
        },
      },
});

const COLORS = [
    'red',
    'yellow',
    'blue',
    'black',
    'white'
]

const ColorRadio = props => {
    const classes = useStyles();
    const { color } = props;
    return (
        <Radio
          className={classes.root}
          disableRipple
          color="default"
          checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} style={{'backgroundColor':color}} />}
          icon={<span className={classes.icon} style={{'backgroundColor':color}} />}
          {...props}
        />
      );
}

const ColorChoices = props => {
    const { currentColor, onColorChange } = props;
    const classes = useStyles();
    return (
        <RadioGroup
            row
            aria-label="Switch Color"
            name="switch-color"
            value={currentColor}
            onChange={(e) => onColorChange(e)}
        >
            {COLORS.map(color => (
                <FormControlLabel
                    key={color}
                    value={color}
                    control={<ColorRadio color={color} />}
                    label={color}
                />
            ))}
        </RadioGroup>
    )
}

class ForegroundBackgroundCanvas extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentBrush: 'foreground',
            currentColor: 'red',
        }
    }

    componentDidMount() {
        this.setState({
            currentBrush:'foreground',
            currentColor: 'red'
        });
    }

    onForeground = () => {
        this.setState({ currentBrush:'foreground' });
    }

    onBackground = () => {
        this.setState({ currentBrush:'background' });
    }

    onColorChange = event => {
        event.preventDefault();
        this.setState({ currentColor:event.target.value });
    }

    render() {
        const { showUID, inputID, teamUID, userUID } = this.props.ids;
        const firebaseRef = this.props.firebase.individualUserInput(showUID, inputID, teamUID, userUID);
        const { currentBrush, currentColor } = this.state;
        return (
            <Box mt={2}>
                <Box mb={1}>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={6}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={this.onForeground}
                                disabled={currentBrush==="foreground"}
                            >
                                FOREGROUND
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={this.onBackground}
                                disabled={currentBrush==="background"}
                            >
                                BACKGROUND
                            </Button>                      
                        </Grid>
                    </Grid>
                </Box>
                <Box mb={1}>
                    <Grid container spacing={2} justifyContent="center">
                        <ColorChoices currentColor={currentColor} onColorChange={this.onColorChange} />
                    </Grid>
                </Box>

                <P5CanvasAlwaysDrawing
                    key={inputID}
                    ids={this.props.ids}
                    firebaseRef={firebaseRef}
                    currentBrush={currentBrush}
                    currentColor={currentColor}
                />

            </Box>
        );
    }
}

/*-------------------Export-------------------*/ 
export default compose(
    withFirebase,
  )(ForegroundBackgroundCanvas);