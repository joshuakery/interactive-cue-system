import React, { Component} from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';

import {
    Typography,
    Box,
} from '@material-ui/core';

import BracketView from './bracketView';
import GamifiedLeaderboardControls from './gamifiedLeaderboardControls';
import UserDrawingsDisplay from './userDrawingsDisplay';

class InputTable extends Component {
    constructor(props){
        super(props);
    }

    render() {
        const { showUID } = this.props;

        return (
            <Box mt={4} mb={6}>
                <Typography variant="h4">
                    Audience Input
                </Typography>
                <GamifiedLeaderboardControls ids={{ showUID:showUID, inputID:'gamified-leaderboard' }} />
                <BracketView ids={{ showUID:showUID, inputID:'cue3' }} />
                {/* <UserDrawingsDisplay ids={{ showUID:this.props.showUID, inputID:'cue3' }} /> */}
            </Box>
        );
    }

};

export default compose(
    withFirebase,
  )(InputTable);