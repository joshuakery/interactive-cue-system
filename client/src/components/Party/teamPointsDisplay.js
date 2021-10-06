import React, { Component }  from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';

import {
  Box,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper,
} from '@material-ui/core';

class TeamsPointsDisplay extends Component {
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

  render() {
    const { teams, show } = this.state;
    return(
      <Box m={4}>
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
                        <InningsRows innings={show.innings} teams={teams} />
                    </TableBody>
                </Table>
            </TableContainer>
        }
      </Box>
    )
  }
}

const InningsRows = props => {
    const { innings,teams } = props;
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
                        {point}
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
  )(TeamsPointsDisplay);