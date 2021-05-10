import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';

import NextCueButton from './nextCue';
import PrevCueButton from './prevCue';
import CurrentCueDisplay from './currentCueDisplay';

import {
    Button,
    TextField,
    InputAdornment,
    Grid, Box
} from '@material-ui/core';

/**
 * The Main Controls allow the admin to change the current cue
 * 
 * Modeled after a light board with a cue stack and a 'GO' button
 *
 */
class MainControls extends Component {
    constructor(props) {
        super(props);
     
        this.state = {
            loading: true,
            goToCueValue: '',
            current_cue: {},
            current_cue_index: 0,
            next_cue: {},
            prev_cue: {},
            cues: [],
        };
    }

    getCurrentCueIndex = (cues, current_cue) => {
        const found_cue = cues.find(cue => cue.number == current_cue.number);
        if (!found_cue) return 0;
        const index = cues.indexOf(found_cue);
        return index;
    }

    getNextCue = (cues, current_cue_index) => {
        const next_index = Math.min( current_cue_index + 1, Object.keys(cues).length - 1 );
        return cues[next_index]; 
    }

    getPrevCue = (cues, current_cue_index) => {
        const prev_index = Math.max( current_cue_index - 1, 0 );
        return cues[prev_index];       
    }

    /**
     * Helper function for sorting cues lowest to highest
     *
     */
    compareCues = (a,b) => {
        if (a.number > b.number) return 1;
        return -1;
    }

    componentDidMount() {
        this.setState({ loading: true });

        this.props.firebase.cues().on('value', async (snapshot) => {
            const cues = snapshot.val();
            if (!cues) return;

            /* cues are stored as an object, so we must sort into an ordered list */
            const sortedCues = [];
            Object.keys(cues).forEach(uid => {
                sortedCues.push({...cues[uid], uid:uid});
            });
            sortedCues.sort(this.compareCues);

            let current_cue = {};
            await this.props.firebase.currentCue().once('value', snapshot => {
                current_cue = snapshot.val(); 
            });

            /* current_cue_index used with onNextCue, onPrevCue to switch to the index +/- 1 */
            const current_cue_index = this.getCurrentCueIndex(sortedCues, current_cue);
            /* next_cue used for display purposes, on the 'NEXT CUE' button */
            const next_cue = this.getNextCue(sortedCues, current_cue_index);
            /* prev_cue used for display purposes, on the 'PREV CUE' button */
            const prev_cue = this.getPrevCue(sortedCues, current_cue_index);

            this.setState({
              loading: false,
              cues: sortedCues,
              current_cue: current_cue,
              current_cue_index: current_cue_index,
              next_cue: next_cue,
              prev_cue: prev_cue,
            });

        });

    }

    componentWillUnmount() {
        this.props.firebase.currentCue().off();
        this.props.firebase.cues().off();
    }

    /**
     * Helper function to set the current_cue in firebase and the state
     * for onNextCue, onPrevCue, and onGoToCue
     *
     */
    setCue = ( new_cue_index ) => {
        const { cues } = this.state;

        const current_cue = cues[new_cue_index];
        const next_index = Math.min( new_cue_index + 1, Object.keys(cues).length - 1 );
        const next_cue = cues[next_index];
        const prev_index = Math.max( new_cue_index - 1, 0 );
        const prev_cue = cues[prev_index];

        this.props.firebase.currentCue().set(current_cue);
        this.setState({
            goToCueValue: '',
            current_cue: current_cue,
            current_cue_index: new_cue_index,
            next_cue: next_cue,
            prev_cue: prev_cue,
        });
    }

    onNextCue = () => {
        const { current_cue_index, cues } = this.state;
        const next_index = Math.min( current_cue_index + 1, Object.keys(cues).length - 1 );
        this.setCue(next_index);
    }

    onPrevCue = () => {
        const { current_cue_index, cues } = this.state;
        const prev_index = Math.max( current_cue_index - 1, 0 );
        this.setCue(prev_index);
    }

    onGoToCueChange = event => {
        const value = event.target.value;
        this.setState({
            goToCueValue: value,
        });
    }

    onGoToCue = event => {
        event.preventDefault();
        const { goToCueValue, cues } = this.state;
        /* because we cannot have a non-existent cue be the current_cue */
        if (goToCueValue == '') return;

        const goToCueNum = parseInt(goToCueValue);
        const found_cue = cues.find(cue => (
            cue.number == goToCueNum ||
            cue.note == goToCueValue
        ));
        /* because we cannot have a non-existent cue be the current_cue */
        if (!found_cue) {
            this.setState({
                goToCueValue: '',
            });
            return;
        }

        const index = cues.indexOf(found_cue);
        this.setCue(index);
    }

    /**
     * checks if a given cue can be found based as a number or a note
     * because we cannot have a non-existent cue be the current_cue
     * so the user should not be able to input one
     *
     */
    isValidCue = goToCueValue => {
        if (goToCueValue == '') return false;

        const { cues } = this.state;
        const goToCueNum = parseInt(goToCueValue);
        const found_cue = cues.find(cue => (
            cue.number == goToCueNum ||
            cue.note == goToCueValue
        ));
        if (!found_cue) {
            return false;
        }

        return true;
    }

    render() {
        const { goToCueValue, cues, current_cue, next_cue, prev_cue } = this.state;
        return(
            <Box mt={4} mb={4}>
            <form onSubmit={(e) => this.onGoToCue(e)}>
            <Grid container spacing={1} justify="space-between">

                <Grid item xs={12} sm={4} container spacing={3}>
                    <Grid item xs={12} container spacing={1}>
                        <Grid item xs={12}>
                            <NextCueButton nextCue={next_cue} onNextCue={this.onNextCue} />
                        </Grid>
                        <Grid item xs={12}>
                            <PrevCueButton prevCue={prev_cue} onPrevCue={this.onPrevCue} />
                        </Grid>
                    </Grid>
                    <Grid item container xs={12} spacing={1}>
                        
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    id="outlined-basic"
                                    label="Go To Cue"
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">Cue</InputAdornment>,
                                    }}
                                    name="goToCue"
                                    type="text"
                                    value={goToCueValue}
                                    onChange={(e) => this.onGoToCueChange(e)}
                                />                              
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    fullWidth={true}
                                    size="large"
                                    disabled={!this.isValidCue(goToCueValue)}
                                >
                                    GO!
                                </Button>
                            </Grid>
                        
                    </Grid>
                </Grid>

                <Grid item xs={12} sm={3} container spacing={1}>
                    <CurrentCueDisplay current_cue={current_cue} />
                </Grid>

            </Grid>
            </form>
            </Box>
        )
    }
}


export default compose(
    withFirebase,
  )(MainControls);