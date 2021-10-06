import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';
import _ from "lodash";

import {
    Button, TextField,
    Typography,
    Box, Grid,
    Accordion, AccordionSummary, AccordionDetails,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
    KeyboardTimePicker
  } from "@material-ui/pickers";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

import { makeStyles } from '@material-ui/core/styles';
import theme from '../../../theme';
const useStyles = makeStyles(theme => ({
    submitChange: {
        [theme.breakpoints.down('md')]: {
            lineHeight: '1em',
        },
    },
}));


class EditCurrentShow extends Component {
    constructor(props) {
        super(props);
     
        this.state = {
            loading: true,
            shows: {},
            current_show_id: '',
            current_show: {
                name: '',
                date: new Date(),
                time: new Date(),
                innings: 0,
            },
        };
    }

    componentDidMount() {
        this.setState({ loading: true });

        this.props.firebase.shows().on('value', (snapshot) => {
            const shows = snapshot.val();
            if (!shows) {
                return;
            }

            this.setState({
                shows: shows,
            });

            this.props.firebase.viewedShowID().on('value', snapshot => {
                const current_show_id = snapshot.val();

                if (!current_show_id) {
                    return;

                } else {

                    this.setState({
                        current_show_id: current_show_id,
                    });

                    this.props.firebase.show(current_show_id).once('value', snapshot => {
                        const current_show = snapshot.val();
                        current_show.date = new Date(current_show.date);
                        current_show.time = new Date(current_show.time);
                        this.setState({
                            loading: false,
                            current_show: current_show
                        });
                    })

                }
            });

        });
    }

    componentWillUnmount() {
        this.props.firebase.viewedShowID().off();
        this.props.firebase.shows().off();
    }

    onChange = event => {
        const value = event.target.value;
        const name = event.target.name;

        const { current_show } = this.state;
        current_show[name] = value;
        this.setState({ current_show:current_show });
    }

    handleDateChange = date => {
        const { current_show } = this.state;
        current_show.date = new Date(date);
        this.setState({ current_show:current_show });
    }

    handleTimeChange = time => {
        const { current_show } = this.state;
        current_show.time = new Date(time);
        this.setState({ current_show:current_show });
    }

    onSubmit = () => {
        const { current_show, current_show_id } = this.state;
        console.log(current_show);
        Object.keys(current_show).forEach(property => {
            if (current_show[property] instanceof Date) {
                current_show[property] = current_show[property].toString()
            }
        })
        this.props.firebase.show(current_show_id).set(current_show);
    }

    render() {
        const { current_show, shows, current_show_id } = this.state;
        const { name, date, time, innings } = current_show;
        return(
            <Box mt={4} mb={4}>
            {current_show &&
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Typography variant="body1">
                        Edit Show
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <TextField
                                id="name"
                                label="Name"
                                variant="outlined"
                                name="name"
                                value={name}
                                onChange={(e) => this.onChange(e)}
                                type="text"
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                label="Show Date"      
                                placeholder="2021/10/10"
                                value={current_show.date}
                                onChange={date => this.handleDateChange(date)}
                                format="yyyy/MM/dd"
                            />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={3}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardTimePicker
                                label="Start Time"
                                placeholder="010:00 AM"
                                mask="__:__ _M"
                                value={current_show.time}
                                onChange={time => this.handleTimeChange(time)}
                            />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                id="innings"
                                label="Games"
                                variant="outlined"
                                name="innings"
                                value={current_show.innings}
                                onChange={(e) => this.onChange(e)}
                                type="number"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} container justifyContent="flex-end">
                            <SubmitShowChangesButton
                                onClick={this.onSubmit}
                                disabled={_.isEqual(current_show,shows[current_show_id]) ||
                                            current_show.innings <= 0}
                            />
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
            }
            </Box>
        )
    }
}

const SubmitShowChangesButton = (props) => {
    const { onClick, disabled } = props;
    const classes = useStyles(theme);
    return (
        <Button
            variant="contained"
            color="secondary"
            className={classes.submitChange}
            onClick={onClick}
            disabled={disabled}
        >
            SUBMIT CHANGES
        </Button>
    );
}


export default compose(
    withFirebase,
  )(EditCurrentShow);