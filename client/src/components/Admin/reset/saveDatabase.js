import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';

import ConfirmButton from './confirmButton';
import { saveShow } from './utils';

class SaveDatabase extends Component {
    render() {
        return(
            <ConfirmButton
                buttonText="DOWNLOAD SHOW DATA"
                confirmation="Download this show?"
                success="Audience input cleared!"
                action={(e) => saveShow(this.props.firebase, this.props.showUID)}
            />
        );
    }
}

export default compose(
    withFirebase,
)(SaveDatabase);