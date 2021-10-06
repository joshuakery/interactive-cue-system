export const resetCues = (firebase, showUID) => {
    firebase.cues(showUID).set(null);
    const first_cue = {
        number: 0,
        note: 'First Cue',
    };
    firebase.cues(showUID).push(first_cue);
    firebase.currentCue(showUID).set(first_cue);
}

const removeUsersTeams = (firebase, showUID) => {
    firebase.users().once('value', snapshot => {
        const users = snapshot.val();
        Object.keys(users).forEach(userUID => {
            const user = users[userUID];
            if (user.show === showUID) {
                delete user.team;
            }
        });
        firebase.users().set(users);
    });
}

export const resetTeams = (firebase, showUID) => {
    //all users from this show must be removed from their teams
    removeUsersTeams(firebase, showUID);
    //and teams should be replaced with one team, unassigned
    const teams = {
        unassigned: {
            name: "Unassigned",
            colors: {
                primary: 'black',
            },
        }
    };
    firebase.teams(showUID).set(teams);
}

export const clearInput = (firebase, showUID) => {
    firebase.allUserInput(showUID).set('');
}

//https://stackoverflow.com/questions/926332/how-to-get-formatted-date-time-like-2009-05-29-215557-using-javascript/30948017
const getFormattedDateNow = () => {
    var d = new Date();

    d = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2) + "--" + ('0' + d.getHours()).slice(-2) + "-" + ('0' + d.getMinutes()).slice(-2) + "-" + ('0' + d.getSeconds()).slice(-2);

    return d;
}

export const saveShow = async (firebase, showUID) => {
    //fetch data
    const jsonData = {};
    await firebase.show(showUID)
    .once('value', snapshot => {
        const show = snapshot.val();
        jsonData.shows = {};
        jsonData.shows[showUID] = show;
    });
    await firebase.users()
    .once('value', snapshot => {
        const users = snapshot.val();
        jsonData.users = users;
    });
    //create file and download
    const fileData = JSON.stringify(jsonData);
    const blob = new Blob([fileData], {type: "text/plain"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const filename = `${getFormattedDateNow()}--Packing-and-Cracking.json`;
    link.download = filename;
    link.href = url;
    link.click();
}

export const resetBracket = (firebase, showUID, inputID) => {
    firebase.showWideInput(showUID,inputID)
    .once('value', snapshot => {
        const input = snapshot.val();
        const bracket = createBracket(input);
        firebase.bracket(showUID,inputID).set(bracket);
    });
}

const createBracket = input => {
    //setup empty bracket
    const bracket = {}
    bracket.currentBattle = {
        round: 0,
        pair: 0,
    };
    bracket.rounds = [];
    //get all users together
    const users = []
    Object.keys(input).forEach(teamUID => {
        if (teamUID === 'bracket') return;
        const userUIDs = input[teamUID];
        Object.keys(userUIDs).forEach(userUID => {
            const userInput = userUIDs[userUID];
            users.push({
                teamUID:teamUID,
                userUID:userUID,
            });
        });
    });
    //craft pairs for each round
    //randomly assign each userInput to a slot
    const numPairs = Math.ceil(users.length/2);
    const roundPairs = [];
    for (let p=0; p<numPairs; p++) {
        roundPairs.push({
            a: removeRandomUser(users),
            b: removeRandomUser(users),
        });
    }
    bracket.rounds.push(roundPairs);
    console.log('completed bracket');
    console.log(bracket);
    return bracket;
    
}

const removeRandomUser = users => {
    if (users.length) {
        return removeRandom(users);
    } else {
        return {};
    }
}

const removeRandom = array => {
    const randomIndex = Math.floor(Math.random() * array.length);
    const el = array.splice(randomIndex,1)[0];
    return el;
}

const countVotes = votes => {
    const counts = {};
    Object.keys(votes).forEach(voter => {
        const vote = votes[voter];
        const { teamUID, userUID } = vote;
        if (!counts[teamUID]) counts[teamUID] = {};
        const team = counts[teamUID];
        if (!team[userUID]) team[userUID] = 0;
        team[userUID] += 1;
    });
    return counts;
}

const getWinner = counts => {
    const winner = {
        teamUID: '',
        userUID: '',
        count: 0,
    };
    Object.keys(counts).forEach(cTeamUID => {
        const cTeam = counts[cTeamUID]; //candidate's team
        Object.keys(cTeam).forEach(candidateUID => {
            const count = cTeam[candidateUID];
            if (count >= winner.count) {
                winner.teamUID = cTeamUID;
                winner.userUID = candidateUID;
                winner.count = count;
            }
        });
    });
    return winner;
}

export const calcNextRound = bracket => {
    const { round } = bracket.currentBattle;
    
    const currentRound = bracket.rounds[round];
    const newRound = [];
    //get all winners together
    const winners = []
    currentRound.forEach(pair => {
        const counts = countVotes(pair.votes);
        const winner = getWinner(counts);
        winners.push(winner);
    });
    //randomly assign each winner to a slot
    const numPairs = Math.ceil(currentRound.length/2);
    for (let p=0; p<numPairs; p++) {
        newRound.push({
            a: removeRandomUser(winners),
            b: removeRandomUser(winners),
        });
    }
    //set round in bracket
    if (bracket.rounds[round+1]) {
        bracket.rounds[round+1] = newRound;
    } else {
        bracket.rounds.push(newRound);
    }
    console.log('next round calculated');
    console.log(bracket);
    return bracket;
}