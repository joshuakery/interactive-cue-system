import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';

import CurrentShowDisplay from './currentShowDisplay';
import SaveDatabase from '../reset/saveDatabase';

import {
    Button, Typography,
    TextField,
    InputAdornment,
    Grid, Box,
    FormControl, InputLabel, Select, MenuItem,
} from '@material-ui/core';

/**
 * The Select Show allow the admin to select the current show
 *
 */
class SelectShow extends Component {
    constructor(props) {
        super(props);
     
        this.state = {
            loading: true,
            shows: {},
            current_show_id: '',
            current_show: {},
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

    onSelectChange = event => {
        event.preventDefault();
        this.props.firebase.viewedShowID().set(event.target.value);
        //set team to unassigned for this user
        const userUID = this.props.authUser.uid;
        this.props.firebase
        .user(userUID)
        .once('value',snapshot => {
            const user = snapshot.val();
            user.team = "unassigned"
            this.props.firebase
            .user(userUID)
            .set(user);
        });
        
    }

    render() {
        const { shows, current_show, current_show_id } = this.state;

        return(
            <Box mt={4} mb={4}>
            {(Object.keys(shows).length > 0 && current_show) &&
            <Grid container spacing={1} justifyContent="space-between">

                <Grid item xs={12} sm={4} container spacing={3}>
                    <FormControl variant="filled">
                        <InputLabel id={"selectShow"}>Show</InputLabel>
                        <Select
                            labelId={"selectShow"}
                            id={"selectShow"}
                            value={current_show_id}
                            onChange={(e) => this.onSelectChange(e)}
                            inputProps={{
                                name: "selectShow",
                                id: "selectShow",
                            }}
                        >
                            {Object.keys(shows).map(showID => (
                                <MenuItem key={showID} value={showID}>
                                    {shows[showID].name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={3} container spacing={1}>
                    <CurrentShowDisplay current_show={current_show} />
                </Grid>

                <Grid item xs={12} container spacing={1}>
                    <SaveDatabase showUID={current_show_id} />
                </Grid>

            </Grid>
            }
            </Box>
        )
    }
}


export default compose(
    withFirebase,
  )(SelectShow);