import React, { Component }  from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';

import {
    Button,
    TextField,
  Box,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper,
} from '@material-ui/core';

class TeamsPoints extends Component {
  constructor(props) {
      super(props);

      this.state = {
          teams:{},
          show:{},
          showListener:null,
      }
  }

  componentDidMount() {
    const { showUID } = this.props;

    this.props.firebase
    .teams(showUID)
    .on('value', snapshot => {
        const teams = snapshot.val();
        this.setState({ teams:teams });
    });

    const showListener = this.props.firebase.show(showUID)
    .on('value',snapshot => {
        const show = snapshot.val();
        this.setState({ show:show });
    });
    this.setState({ showListener:showListener });

  }

  componentDidUpdate(prevProps) {
    if (prevProps.showUID !== this.props.showUID) {
        this.props.firebase.teams(prevProps.showUID).off();
        this.props.firebase
        .teams(this.props.showUID)
        .on('value', snapshot => {
            const teams = snapshot.val();
            this.setState({ teams:teams });
        });

        const { showListener } = this.state;
        this.props.firebase.show(prevProps.showUID).off('value',showListener);
        this.props.firebase
        .show(this.props.showUID)
        .on('value',snapshot => {
            const show = snapshot.val();
            this.setState({ show:show });
        });
    }
  }

  componentWillUnmount() {
    this.props.firebase.teams(this.props.showUID).off();
    const { showListener } = this.state;
    this.props.firebase.show(this.props.showUID).off('value',showListener);
  }

  onChangePoint = (event,teamUID,inning) => {
    const value = event.target.value;
    const { teams } = this.state;
    const team = teams[teamUID];
    if (!team.points) team.points = {}
    team.points[inning] = value;
    this.props.firebase.teamPoints(this.props.showUID,teamUID)
    .set(team.points)
    this.setState({ teams:teams });
  }

  render() {
    const { showUID } = this.props;
    const { teams, show } = this.state;
    return(
      <Box mt={4} mb={4}>
        {teams &&
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                        <TableCell>
                            Game
                        </TableCell>
                        {Object.keys(teams).map(teamUID => {
                            if (teamUID === "unassigned") return;
                            const team = teams[teamUID];
                            return (
                                <TableCell key={teamUID}>
                                    {team.name}
                                </TableCell>
                            )
                        })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <InningsRows innings={show.innings} teams={teams} onChangePoint={this.onChangePoint}/>
                    </TableBody>
                </Table>
            </TableContainer>
        }
      </Box>
    )
  }
}

const InningsRows = props => {
    const { innings,teams,onChangePoint } = props;
    const rows = [];
    for (let i = 1; i <= innings; i++) {
        const row = (
            <TableRow key={i}>
            <TableCell>
                {i}
            </TableCell>
            {Object.keys(teams).map(teamUID => {
                if (teamUID === "unassigned") return;
                const team = teams[teamUID];
                const point = team.points && team.points[i] ? team.points[i] : '';
                return (
                    <TableCell key={teamUID}>
                        <TextField
                            id={`${teamUID}-point-${i}`}
                            variant="outlined"
                            fullWidth={true}
                            name="point"
                            value={point}
                            onChange={(e) => onChangePoint(e,teamUID,i)}
                            type="text"
                        />
                    </TableCell>
                )
            })}
            </TableRow>
        );
        rows.push(row);
    }
    return rows;
}

export default compose(
    withFirebase,
  )(TeamsPoints);