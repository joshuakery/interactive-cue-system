import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';
import * as ROLES from '../../../constants/roles';
import _ from "lodash";

import {
    Box,
    ButtonGroup, Button,
  Typography,
  TextField, Checkbox,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper,
  FormControl, InputLabel, Select, MenuItem,
} from '@material-ui/core';

class UsersTable extends Component {
    constructor(props) {
        super(props);
     
        this.state = {
          editing: false,
          error: null,
          changedUsers: {},
          shows: {},
        };
    }

    componentDidMount() {
        this.setState({
            changedUsers: _.cloneDeep(this.props.users),
        });

        this.props.firebase.shows().on('value', snapshot => {
            const shows = snapshot.val();
            this.setState({ shows:shows });
        });

    }

    componentDidUpdate(prevProps) {
        if (prevProps.users !== this.props.users) {
            this.setState({
                changedUsers: _.cloneDeep(this.props.users),
            });
        }
    }

    componentWillUnmount() {
        // this.props.firebase.shows().off();
    }

    onSave = event => {
        event.preventDefault();
        const { changedUsers } = this.state;
        if (Object.keys(changedUsers).length === 0) {
            this.setState({ editing:false });
        } else {
            Object.keys(changedUsers).forEach(userUID => {
                const user = changedUsers[userUID];
                this.props.firebase.user(userUID).set(user, (error) => {
                    if (error) {
                        this.setState({ error });
                    } else {
                        this.setState({ editing: false });
                    }
                });
            });
        }
      }
  
      onEdit = event => {
        event.preventDefault();
        this.setState({ editing: true });
      }
      
      handleUserChange = (event, uid) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        const { changedUsers } = this.state;
        changedUsers[uid][name] = value;
        this.setState({ changedUsers:changedUsers });
      }

      onChangeShows = (event, uid) => {
        const target = event.target;
        const value = target.value;

        const { changedUsers } = this.state;
        changedUsers[uid].show = value;
        changedUsers[uid].team = "unassigned"
        this.setState({ changedUsers:changedUsers });
      }
      
      onChangeRoles = (event, uid) => {
          const target = event.target;
          const value = target.checked;
          const name = target.name;

          const { changedUsers } = this.state;
          changedUsers[uid].roles[name] = value;
          this.setState({ changedUsers:changedUsers });
      }

      render() {
          const { editing, changedUsers, shows, error } = this.state;
          return (
            <div>
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
                        users={changedUsers}
                        onChangeRoles={this.onChangeRoles}
                        onChangeShows={this.onChangeShows}
                        handleUserChange={this.handleUserChange}
                        authUser={this.props.authUser}
                        shows={shows}
                    />) :
                    (<UsersTableNotEditable
                        users={this.props.users}
                        shows={shows}
                    />)
                }
                </Table>
            </TableContainer> 
            {error && <p>{error.message}</p>}
          </div>
          )
      }
}

export default compose(
    withFirebase,
  )(UsersTable);

const UsersTableHead = () => (
    <TableHead>
        <TableRow>
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
                        Assigned Show
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
     * displays a table with static cells of user info
     * 
     * the usersControls uses this editing/not editing switch
     * because these user-created values should be changed sparingly by admins
     *
     */
    const UsersTableNotEditable = ({ users, shows }) => (
    <TableBody>
    {Object.keys(users).map(uid => {
        const user = users[uid];
        return (
        <TableRow key={uid}>
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
                {shows[user.show] ? shows[user.show].name : 'nothing'}
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

/**
 * displays a table with input fields to change user attributes
 * 
 * the usersControls uses this editing/not editing switch
 * because these user-created values should be changed sparingly by admins
 *
 */
const UsersTableEditable = ({ users, onChangeRoles, handleUserChange, onChangeShows, authUser, shows }) => (
    <TableBody>
      {Object.keys(users).map(uid => {
          const user = users[uid];
          return (
            <TableRow key={uid}>
              <TableCell>
                <TextField
                    id={`user-${uid}-email`}
                    variant="outlined"
                    name="email"
                    type="text"
                    value={user.email}
                    onChange={(e) => handleUserChange(e, uid)}
                /> 
              </TableCell>
              <TableCell>
                <TextField
                    id={`user-${uid}-username`}
                    variant="outlined"
                    name="username"
                    type="text"
                    value={user.username}
                    onChange={(e) => handleUserChange(e, uid)}
                /> 
              </TableCell>
              <TableCell>
                    <FormControl variant="filled">
                        <InputLabel id={"show"}>Show</InputLabel>
                        <Select
                            labelId={"show"}
                            id={"show"}
                            value={user.show}
                            onChange={(e) => onChangeShows(e, uid)}
                            inputProps={{
                                name: "show",
                                id: "show",
                            }}
                        >
                            {Object.keys(shows).map(showID => (
                                <MenuItem key={showID} value={showID}>
                                    {shows[showID].name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
              </TableCell>
              <TableCell>
                {uid !== authUser.uid ?
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