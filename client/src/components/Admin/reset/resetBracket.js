import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';

import ConfirmButton from './confirmButton';
import { resetBracket } from './utils';

class ResetBracketButton extends Component {
    render() {
        return(
            <ConfirmButton
                buttonText="RESET BRACKET"
                confirmation="Regenerate bracket and clear all votes?"
                success="Bracket reset!"
                action={(e) => resetBracket(this.props.firebase, this.props.showUID, this.props.inputID)}
            />
        );
    }
}

export default compose(
    withFirebase,
)(ResetBracketButton);