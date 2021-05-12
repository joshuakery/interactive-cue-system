import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';

import ConfirmButton from './confirmButton';

class ClearInputButton extends Component {
    clearInput = () => {
        this.props.firebase.allUserInput().set(null);
    }

    render() {
        return(
            <ConfirmButton
                buttonText="CLEAR ALL AUDIENCE INPUT"
                confirmation="Delete all audience input from the database?"
                success="Audience input cleared!"
                action={this.clearInput}
            />
        );
    }
}

export default compose(
    withFirebase,
)(ClearInputButton);