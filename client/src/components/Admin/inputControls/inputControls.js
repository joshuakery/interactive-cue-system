import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';

import {
    Box,
} from '@material-ui/core';

import InputTable from './inputTable';
import ClearInputButton from '../reset/clearInputButton';

class InputControls extends Component {
    render() {
        return(
            <div>
                <Box mt={4} mb={4}>
                    <InputTable />
                    <ClearInputButton />
                </Box>
            </div>
        );
    }
}

export default compose(
    withFirebase,
  )(InputControls);