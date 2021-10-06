import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';

import {
    Box,
} from '@material-ui/core';

import DisplayCanvas from './displayCanvas';

class DrawingsDisplay extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        const { showUID, inputID } = this.props;
        this.props.firebase.showWideInput(showUID,inputID)
        .on('child_added', snapshot => {
            const 
        });
    }

    render() {
        const { showUID, inputID } = this.props;
        return(
            <div>
                <Box mt={4} mb={4}>
                    
                </Box>
            </div>
        );
    }
}

export default compose(
    withFirebase,
  )(DrawingsDisplay);