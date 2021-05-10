import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';

import ConfirmButton from './confirmButton';

class ResetCuesButton extends Component {
    constructor(props) {
        super(props);
    }

    resetCues = () => {
        this.props.firebase.cues().set(null);
        const first_cue = {
            number: 0,
            note: 'First Cue',
        };
        const uid = this.props.firebase.cues().push(first_cue);
        this.props.firebase.currentCue().set(first_cue);
    }

    render() {
        return(
            <ConfirmButton
                buttonText="RESET CUES"
                confirmation="Delete all cues? (This will create one default cue: First Cue, 0 )"
                success="Cues reset!"
                action={this.resetCues}
            />
        );
    }
}

export default compose(
    withFirebase,
)(ResetCuesButton);