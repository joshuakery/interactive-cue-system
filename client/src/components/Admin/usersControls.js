import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import * as ROLES from '../../constants/roles';

import {
  Box,
  Typography,
  ButtonGroup, Button,
  TextField, Checkbox,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper,
} from '@material-ui/core';

class UsersControls extends Component {
    constructor(props) {
        super(props);
     
        this.state = {
          loading: true,
          editing: false,
          users: {},
          error: null,
        };
    }

    componentDidMount() {
        this.setState({ loading: true });
     
        this.props.firebase.users().on('value', snapshot => {
          const users = snapshot.val();
          
          this.setState({
            loading: false,
            users: users,
          });
        });
    }
    
    componentWillUnmount() {
        this.props.firebase.users().off();
    }

    onSave = event => {
      event.preventDefault();
      this.props.firebase.users().set(this.state.users, (error) => {
        if (error) {
          this.setState({ error });
        } else {
          this.setState({ editing: false });
        }
      });
    }

    onEdit = event => {
      event.preventDefault();
      this.setState({ editing: true });
    }
    
    handleUserChange = (event, uid) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        const newUsers = {...this.state.users};
        newUsers[uid][name] = value;
    
        this.setState({
          users: newUsers
        });
    }
    
    onChangeRoles = (event, uid) => {
        const target = event.target;
        const value = target.checked;
        const name = target.name;
    
        const newUsers = {...this.state.users};
        newUsers[uid].roles[name] = value;
    
        this.setState({ users: newUsers });
    }

    render() {
        const { users, loading, editing, error } = this.state;
        return(
        <div>
            <Box mt={4} mb={4}>
              <Typography variant="h4">
                Audience
              </Typography>
              {loading && <div>Loading ...</div>}
              <Box mt={2} mb={2}>
                <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                  <Button
                    disabled={editing}
                    onClick={this.onEdit}
                  >
                    EDIT
                  </Button>
                  <Button
                    color="secondary"
                    disabled={!editing}
                    onClick={this.onSave}
                  >
                    SAVE
                  </Button>
                </ButtonGroup>
              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <UsersTableHead />
                  { editing ?
                      (<UsersTableEditable
                        users={users}
                        onChangeRoles={this.onChangeRoles}
                        handleUserChange={this.handleUserChange}
                        authUser={this.props.authUser}
                      />) :
                      (<UsersTableNotEditable users={users} />)
                  }
                </Table>
              </TableContainer>
              {error && <p>{error.message}</p>}
            </Box>   
        </div>)
    }
}

const UsersTableHead = () => (
  <TableHead>
      <TableRow>
          <TableCell>                                
              <Typography variant="body1">
                      UID
              </Typography>
          </TableCell>
          <TableCell>
              <Typography variant="body1">
                      Email
              </Typography>
          </TableCell>
          <TableCell>
              <Typography variant="body1">
                      Username
              </Typography>
          </TableCell>
          <TableCell>
              <Typography variant="body1">
                      Is Admin
              </Typography>
          </TableCell>
      </TableRow>
  </TableHead>
);

/**
 * displays a table with input fields to change user attributes
 * 
 * the usersControls uses this editing/not editing switch
 * because these user-created values should be changed sparingly by admins
 *
 */
const UsersTableEditable = ({ users, onChangeRoles, handleUserChange, authUser }) => (
  <TableBody>
    {Object.keys(users).map(uid => {
        const user = users[uid];
        return (
          <TableRow key={uid}>
            <TableCell>{uid}</TableCell>
            <TableCell>
              <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="email"
                  type="text"
                  value={user.email}
                  onChange={(e) => handleUserChange(e, uid)}
              /> 
            </TableCell>
            <TableCell>
              <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="username"
                  type="text"
                  value={user.username}
                  onChange={(e) => handleUserChange(e, uid)}
              /> 
            </TableCell>
            <TableCell>
              {uid != authUser.uid ?
              (           
              <Checkbox
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                  name={ROLES.ADMIN}
                  type="checkbox"
                  checked={user.roles[ROLES.ADMIN]}
                  onChange={(e) => onChangeRoles(e, uid)}
              />
              ) : (
              <Typography variant="body1">
                {/* Admins should not revoke their own admin privileges */}
                current user
              </Typography>
              )}
            </TableCell>
          </TableRow>
        )
    })}
  </TableBody>
);
  
/**
 * displays a table with static cells of user info
 * 
 * the usersControls uses this editing/not editing switch
 * because these user-created values should be changed sparingly by admins
 *
 */
const UsersTableNotEditable = ({ users }) => (
  <TableBody>
  {Object.keys(users).map(uid => {
      const user = users[uid];
      return (
      <TableRow key={uid}>
          <TableCell>
            <Typography variant="body1">
              {uid}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography variant="body1">
              {user.email}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography variant="body1">
              {user.username}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography variant="body1">
              {user.roles[ROLES.ADMIN] ? "True" : "False"}
            </Typography>
          </TableCell>
      </TableRow>
      )
  })}
  </TableBody>
);

export default compose(
    withFirebase,
  )(UsersControls);