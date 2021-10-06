import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';

import ConfirmButton from './confirmButton';
import { resetCues } from './utils';

class ResetCuesButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <ConfirmButton
                buttonText="RESET CUES"
                confirmation="Delete all cues? (This will create one default cue: First Cue, 0 )"
                success="Cues reset!"
                action={(e) => resetCues(this.props.firebase, this.props.showUID)}
            />
        );
    }
}

export default compose(
    withFirebase,
)(ResetCuesButton);
