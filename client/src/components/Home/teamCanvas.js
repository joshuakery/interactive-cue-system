import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';

import P5Canvas from './p5canvas';

class TeamCanvas extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { showUID, inputID, teamUID, userUID } = this.props.ids;
        const firebaseRef = this.props.firebase.teamInput(showUID, inputID, teamUID);
        return (
            <P5Canvas
                key={inputID}
                ids={this.props.ids}
                firebaseRef={firebaseRef}
            />
        );
    }
}

/*-------------------Export-------------------*/ 
export default compose(
    withFirebase,
  )(TeamCanvas);