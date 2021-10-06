import React, { Component } from 'react';
import { compose } from 'recompose';
import _ from "lodash";
import { withFirebase } from '../../Firebase';

import {
    Button,
    TextField, Checkbox,
    Typography,
    Box,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper
} from '@material-ui/core';

import theme from '../../../theme';
import { withStyles } from '@material-ui/core/styles';

const styles = {
    submitChanges: {
        [theme.breakpoints.down('md')]: {
            lineHeight: '1em',
        },
    },
    currentCue: {
        backgroundColor: theme.palette.secondary.light,
    },
};

class CuesTable extends Component {
    constructor(props) {
        super(props);
     
        this.state = {
            loading: true,
            cues: [],
            /* changedCues used to keep track of cue changes before submit */
            changedCues: {},
            current_cue: {},
        };
    }

    componentDidMount() {
        this.setState({ loading: false });
        this.setupState();
    }

    componentDidUpdate(prevProps) {
        if (this.props.showUID !== prevProps.showUID) {

            //turn off old listeners
            this.props.firebase.cues(prevProps.showUID).off();
            this.props.firebase.currentCue(prevProps.showUID).off();

            //turn on new listeners
            this.setupState();
            
        }
    }

    componentWillUnmount() {
        this.props.firebase.cues(this.props.showUID).off();
        this.props.firebase.currentCue(this.props.showUID).off();
    }

    setupState = () => {
        this.props.firebase.cues(this.props.showUID).on('value', async (snapshot) => {
            const cues = snapshot.val();
            if (!cues) return;

            const sortedCues = [];
            Object.keys(cues).forEach(uid => {
                sortedCues.push({...cues[uid], uid:uid});
            });
            sortedCues.sort(this.compareCues);
    
            this.setState({
              loading: false,
              cues: sortedCues,
            });
        });

        this.props.firebase.currentCue(this.props.showUID).on('value', async (snapshot) => {
            const current_cue = snapshot.val();
            this.setState({
                current_cue: current_cue,
            });
        });

    }

    /**
     * Helper function for sorting cues lowest to highest
     *
     */
    compareCues = (a,b) => {
        if (a.number > b.number) return 1;
        return -1;
    }

    onSubmitCueChanges = (event, cue) => {
        event.preventDefault();

        const { uid } = cue;
        if (this.state.changedCues[uid].remove) {
            this.props.firebase.cue(this.props.showUID, uid).remove();
        } else {
            this.props.firebase.cue(this.props.showUID, uid).update(this.state.changedCues[uid]);
        }
        
        const changedCues = this.state.changedCues;
        delete changedCues[uid];
        this.setState({
            changedCues: changedCues,
        });
    }

    /**
     * records cue changes in changedCues object
     * to let them be saved in state before user hits submit
     *
     */
    onCueChange = (event, cue) => {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        /* makes a deep copy of the cue to avoid changes to the real cues before submit */
        const changedCue = this.state.changedCues[cue.uid] ?
            this.state.changedCues[cue.uid] :
            _.cloneDeep(cue);
        changedCue[name] = value;
        if (name === "number" && value !== '') changedCue[name] = parseInt(value);

        const changedCues = this.state.changedCues;
        changedCues[cue.uid] = changedCue;
        this.setState({
            changedCues: changedCues,
        });
    }

    render() {
        const { loading, cues, changedCues, current_cue } = this.state;
        const { classes, } = this.props;
        return(
        <Box mt={4} mb={6}>
            {loading && <div>Loading ...</div>}
            {(cues.length > 0 && current_cue && Object.keys(current_cue).length > 0) && (
            <div>
            <Box mb={2}>
                <Typography variant="h4">
                    Cues
                </Typography>
            </Box>
            <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>                                
                            <Typography variant="body1">
                                    UID
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="body1">
                                    NUMBER
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="body1">
                                    NOTE
                            </Typography>
                        </TableCell>
                        <TableCell align="center">
                            <Typography variant="body1">
                                    REMOVE
                            </Typography>
                        </TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {cues.map(cue => {
                    cue = changedCues[cue.uid] ? changedCues[cue.uid] : cue;
                    let highlightClass;
                    if (current_cue.number === cue.number) highlightClass = classes.currentCue;
                    return (
                        <TableRow
                            key={cue.uid}
                            className={highlightClass}
                        >
                            <TableCell>
                                <Typography variant="body1" display="inline" noWrap={true}>
                                    {cue.uid}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <TextField
                                    id={"cue-"+cue.number+"-number"}
                                    variant="outlined"
                                    name="number"
                                    type="text"
                                    value={cue.number}
                                    onChange={(e) => this.onCueChange(e, cue)}
                                />   
                            </TableCell>
                            <TableCell>
                                <TextField
                                    id={"cue-"+cue.number+"-note"}
                                    variant="outlined"
                                    name="note"
                                    type="text"
                                    value={cue.note}
                                    onChange={(e) => this.onCueChange(e, cue)}
                                />  
                            </TableCell>
                            <TableCell align="center">
                                <Checkbox
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                    name="remove"
                                    type="checkbox"
                                    value={cue.remove}
                                    onChange={(e) => this.onCueChange(e, cue)}
                                />
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={(e) => this.onSubmitCueChanges(e, cue)}
                                    className={classes.submitChanges}
                                    disabled={!changedCues[cue.uid]}
                                >
                                    SUBMIT CHANGES
                                </Button>
                            </TableCell>
                        </TableRow>
                    )
                    }
                )}
                </TableBody>
            </Table>
            </TableContainer>  
            </div> 
            )}
        </Box>
        )
    }
}

export default compose(
    withStyles(styles),
    withFirebase,
  )(CuesTable);