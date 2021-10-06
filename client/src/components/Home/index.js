import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { withAuthorization } from '../Session';

import cueHTML from './cueHTML';

/* CSS styles are included as a simple stylesheet for easy editing for those new to React */
import "./style.css";

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      showUID: '',
      current_cue: {},
      user: {},
      team: {},
    }
 
  }

  setupListeners = () => {
    this.props.firebase.viewedShowID().on('value', async (snapshot) => {
      const showUID = snapshot.val();

      /* This is very important. This is the listener for a cue change triggered by the admin page. */
      await this.props.firebase.currentCue(showUID).on('value', snapshot => {
        const current_cue = snapshot.val();
        this.setState({
          loading: false,
          current_cue: current_cue,
        });

      });

      /* Respond to changes in the user's metadata or team */
      const { uid } = this.props.authUser;
      this.props.firebase.user(uid).on('value', snapshot => {
        const user = snapshot.val();
        if (!user.team) user.team = "unassigned";
        this.setState({
          user: user,
        });
        // remove listener for changes to the old team
        // to prevent memory leaking i.e. responding to changes to the old team
        const oldTeam = this.state.user.team;
        this.props.firebase.team(showUID, oldTeam).off();
        // create a new listener for changes to the new team
        this.props.firebase.team(showUID, user.team).on('value', snapshot => {
          const team = snapshot.val();
          this.setState({
            team: team,
          });
        })

      });

      this.setState({ showUID:showUID });
    });
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.setupListeners();

  }

  componentWillUnmount() {
    const { uid } = this.props.authUser;
    const { showUID } = this.state;
    this.props.firebase.currentCue(showUID).off();
    this.props.firebase.user(uid).off();
    this.props.firebase.viewedShowID().off();
  }

  calculateContrastingFontColor = (color) => {
  
  }

  getCurrentCueHTML = () => {
    const userUID = this.props.authUser.uid;
    const { current_cue, user, team, showUID } = this.state;
    if (!current_cue) {
      console.log("Current cue configured. State:")
      console.log(this.state);
      return;
    }
    if (cueHTML[current_cue.number]) {
      return cueHTML[current_cue.number](showUID,userUID,user,team);
    }
  }

  render() {
    const { loading, team } = this.state;

    /* Updating CSS variables on the root element in style.css */
    /* https://css-tricks.com/updating-a-css-variable-with-javascript/ */
    const root = document.documentElement;
    if (team && team.colors) {
      root.style.setProperty('--primary-background-color', team.colors.primary);
    } else {
      root.style.setProperty('--primary-background-color', "black");
    }

    return (
      <div className="body">
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
)(HomePage);