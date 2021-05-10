import React, { Component} from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';

import {
    Typography,
    Box,
} from '@material-ui/core';

class InputTable extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Box mt={4} mb={6}>
                <Typography variant="h4">
                    Audience Input
                </Typography>
            </Box>
        );
    }

};

export default compose(
    withFirebase,
  )(InputTable);