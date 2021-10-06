import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';

import {
    Box,
} from '@material-ui/core';

import InputTable from './inputTable';
import ClearInputButton from '../reset/clearInputButton';

class InputControls extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { showUID } = this.props;
        return(
            <div>
                <Box mt={4} mb={4}>
                    <InputTable showUID={showUID} />
                    <ClearInputButton showUID={showUID} />
                </Box>
            </div>
        );
    }
}

export default compose(
    withFirebase,
  )(InputControls);