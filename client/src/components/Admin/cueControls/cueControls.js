import React, { Component } from 'react';

import CuesTable from './cuesTable';
import CreateCueForm from './cuesCreateCue';
import MainControls from './mainControls';
import ResetCuesButton from '../reset/resetCuesButton';

import {
    Box
} from '@material-ui/core';

class CueControls extends Component {
    render() {
        return (
            <Box mt={4} mb={4}>
                <MainControls />
                <CuesTable />
                <CreateCueForm />
                <ResetCuesButton />
            </Box>
        );
    }
}


export default CueControls;