import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';

import ConfirmButton from './confirmButton';
import { clearInput } from './utils';

class ClearInputButton extends Component {
    render() {
        return(
            <ConfirmButton
                buttonText="CLEAR ALL AUDIENCE INPUT"
                confirmation="Delete all audience input from the database?"
                success="Audience input cleared!"
                action={(e) => clearInput(this.props.firebase, this.props.showUID)}
            />
        );
    }
}

export default compose(
    withFirebase,
)(ClearInputButton);