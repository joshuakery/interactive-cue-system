import React, { Component } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';

import {
    Box, Typography,
} from '@material-ui/core';

import P5CanvasAlwaysDrawing from '../../Home/p5canvasAlwaysDrawing'

class UserDrawingsDisplay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inputNodes:{},
            users:{},
        }
    }

    setupListeners = () => {
        const { inputNodes } = this.state;
        const { showUID, inputID } = this.props.ids;

        this.props.firebase.showWideInput(showUID,inputID)
        .on('child_added', snapshot => {

            const teamUID = snapshot.key;
            if (!inputNodes[teamUID]) inputNodes[teamUID] = [];
            this.setState({ inputNodes:inputNodes });

            this.props.firebase
            .teamInput(showUID,inputID,teamUID)
            .on('child_added', snapshot => {
                const userUID = snapshot.key;
                inputNodes[teamUID].push(userUID);
                this.setState({ inputNodes:inputNodes });
            });

        });

        this.props.firebase.users()
        .on('value', snapshot => {
            const users = snapshot.val();
            this.setState({ users:users });
        })
    }

    componentDidMount() {
        this.setupListeners();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.ids !== this.props.ids) {
            this.props.firebase.showWideInput(prevProps.ids.showUID,prevProps.ids.inputID)
            .off();
            this.setupListeners();
        }
    }

    componentWillUnmount() {
        const { showUID, inputID } = this.props.ids;
        this.props.firebase.showWideInput(showUID,inputID)
        .off();
        this.props.firebase.users().off();
    }

    render() {
        const { showUID, inputID } = this.props.ids;
        const { inputNodes, users } = this.state;

        return (
            <Box>
                <Typography variant="h5">{inputID}</Typography>
                {Object.keys(inputNodes).map(teamUID => {
                    const userUIDs = inputNodes[teamUID];
                    return (
                        <Box m={2}>
                            {userUIDs.map(userUID => {
                                const ids = {
                                    showUID:showUID,
                                    inputID:inputID,
                                    teamUID:teamUID,
                                    userUID:userUID,
                                }
                                const firebaseRef = this.props.firebase.individualUserInput(showUID, inputID, teamUID, userUID);
                                return (
                                    <Box mb={1}>
                                        <Typography variant="body2">
                                            {users[userUID] && users[userUID].username}
                                        </Typography>
                                    <P5CanvasAlwaysDrawing
                                        key={`${inputID}-${teamUID}-${userUID}`}
                                        ids={ids}
                                        firebaseRef={firebaseRef}
                                        currentBrush={null}
                                        currentColor={'black'}
                                    />
                                    </Box>
                                )
                            })}
                        </Box>
                    )
                })}

            </Box>
        );
    }
}

export default compose(
    withFirebase,
  )(UserDrawingsDisplay);