import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';
import UsersTable from './userstable';

import {
  Box,
  Typography,
  Grid,
  Accordion, AccordionSummary, AccordionDetails,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class UsersControls extends Component {
    constructor(props) {
        super(props);
     
        this.state = {
          loading: true,
          show: {},
          editing: false,
          viewedShowUsers: {},
          otherUsers: {},
          error: null,
          showListener: null,
        };
    }

    componentDidMount() {
        this.setState({ loading: true });
     
        this.props.firebase.users().on('value', snapshot => {
          const users = snapshot.val();
          const organizedUsers = this.organizeUsers(users);
          this.setState({
            ...organizedUsers,
            loading: false,
          });
        });

        const showListener = this.props.firebase
        .show(this.props.showUID)
        .on('value', snapshot => {

          const show = snapshot.val();
          this.setState({ show: show });

          this.props.firebase.users().once('value', snapshot => {
            const users = snapshot.val();
            const organizedUsers = this.organizeUsers(users);
            this.setState({
              ...organizedUsers,
              loading: false,
            });
          });

        });
        
        this.setState({ showListener:showListener });
    }

    componentDidUpdate(prevProps) {
      if (prevProps.showUID !== this.props.showUID) {
        this.props.firebase.show(prevProps.showUID).off('value', this.state.showListener);
        const showListener = this.props.firebase
        .show(this.props.showUID)
        .on('value', snapshot => {

          const show = snapshot.val();
          this.setState({ show: show });

          this.props.firebase.users().once('value', snapshot => {
            const users = snapshot.val();
            const organizedUsers = this.organizeUsers(users);
            this.setState({
              ...organizedUsers,
              loading: false,
            });
          });

        });

        this.setState({ showListener:showListener });
      }
    }
    
    componentWillUnmount() {
        this.props.firebase.users().off();
        this.props.firebase.show(this.props.showUID).off('value', this.state.showListener);
    }

    organizeUsers = users => {
      const viewedShowUsers = {};
      const otherUsers = {};
      Object.keys(users).forEach(userUID => {
        const user = users[userUID];
        if (user.show === this.props.showUID) {
          viewedShowUsers[userUID] = user;
        } else {
          otherUsers[userUID] = user;
        }
      });
      return ({
        viewedShowUsers: viewedShowUsers,
        otherUsers: otherUsers,
      });
    }

    render() {
        const { show, viewedShowUsers, otherUsers, loading, editing, error } = this.state;
        return(
        <div>
          {show &&
          <Box mt={4} mb={4}>
            {loading && <div>Loading ...</div>}
            <Box mb={4}>
              <Typography variant="h4">
                {`${show.name} Audience`}
              </Typography>
              <UsersTable authUser={this.props.authUser} users={viewedShowUsers} />
            </Box>
            <Box mb={4}>
              <Accordion>
                  <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                  >
                      <Typography variant="h5">
                        {`Other Shows' Audience Members`}
                      </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                      <Box m={2}>
                        <UsersTable authUser={this.props.authUser} users={otherUsers} />
                      </Box>
                  </AccordionDetails>
              </Accordion>
            </Box>
          </Box>  
          } 
        </div>)
    }
}

export default compose(
    withFirebase,
  )(UsersControls);