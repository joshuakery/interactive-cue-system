import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { withAuthorization } from '../Session';

import cueHTML from './cueHTML';

/* CSS styles are included as a simple stylesheet for easy editing for those new to React */
import "./style.css";

class PartyPage extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
        loading: true,
        showUID: '',
        current_cue: {},
      }

  }

  setupListeners = () => {
    this.props.firebase.viewedShowID().on('value', async (snapshot) => {
      const showUID = snapshot.val();
      this.setState({ showUID:showUID });

      /* This is very important. This is the listener for a cue change triggered by the admin page. */
      this.props.firebase.currentCue(showUID).on('value', snapshot => {
        const current_cue = snapshot.val();
        this.setState({
          loading: false,
          current_cue: current_cue,
        });

      });
    });
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.setupListeners();
  }

  componentWillUnmount() {
    const { showUID } = this.state;
    this.props.firebase.currentCue(showUID).off();
    this.props.firebase.viewedShowID().off();
  }

  getCurrentCueHTML = () => {
    const { current_cue, showUID } = this.state;
    if (!current_cue) {
      console.log("Current cue configured. State:")
      console.log(this.state);
      return;
    }
    if (cueHTML[current_cue.number]) {
      return cueHTML[current_cue.number](showUID);
    }
  }

  render() {
    const { loading } = this.state;
    return (
      <div className="partybody">
          <h1>Party Page</h1>
          {loading && <div>Loading ...</div>}
          {this.getCurrentCueHTML()}
      </div>
    );
  }
}

/*-------------------Export-------------------*/
const condition = authUser => !!authUser;
 
export default compose(
  withAuthorization(condition),
  withFirebase,
)(PartyPage);