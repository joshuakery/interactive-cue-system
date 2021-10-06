import TeamCanvas from './teamCanvas';
import UserCanvas from './userCanvas';
import ForegroundBackgroundCanvas from './foregroundBackgroundCanvas';
import DrawingBattleInput from './drawingBattleInput';
import VoteInput from './voteInput';
import QuizQuestion from './quizQuestion';

/* CSS styles are included as a simple stylesheet for easy editing for those new to React */
import "./style.css";

import {
  Grid
} from '@material-ui/core';

/**
 * This is how we define what HTML to show to the audience.
 * 
 * Without creating a GUI, this seems like a simple way for someone new to React
 * to define cues using JSX, with mostly vanilla HTML syntax
 *
 */
 const cueHTML = {};

 cueHTML[1] = (showUID,uid,user,team) => {
   /* to create a team drawing */
   /* the team uid can simply be added to the unique input id here */
   const teamUID = user.team ? user.team : "unassigned";
   const inputID = 'cue1';
   const ids = {
     userUID: uid,
     teamUID: teamUID,
     inputID: inputID,
     showUID: showUID,
   }
   return (
     <div>
       <h1 className="cue1-header">This is the first cue.</h1>
       <p>This drawing canvas is shared with the user's team!</p>
       {/* we pass a key value here so that P5Canvas always reloads on a cue change */}
       <TeamCanvas ids={ids} key={inputID} />
     </div>
   );
 }
 
 cueHTML[2] = (showUID,uid,user,team) => {
   /* to work on a drawing for the individual user only */
   /* the user uid can simply be added to the unique input id here */
   const teamUID = user.team ? user.team : "unassigned";
   const inputID = `cue2`;
   const ids = {
      userUID: uid,
      teamUID: teamUID,
      inputID: inputID,
      showUID: showUID,
    }
   return (
     <div>
       <h1>This is the second cue.</h1>
       <p>This drawing canvas is just for this user!</p>
       {/* we pass a key value here so that P5Canvas always reloads on a cue change */}
       <UserCanvas ids={ids} key={inputID} />
     </div>
   );
 }

 cueHTML[3] = (showUID,uid,user,team) => {
  /* to work on a drawing for the individual user only */
  /* the user uid can simply be added to the unique input id here */
  const teamUID = user.team ? user.team : "unassigned";
  const inputID = `cue3`;
  const ids = {
     userUID: uid,
     teamUID: teamUID,
     inputID: inputID,
     showUID: showUID,
   }
  const bracketID = 'cue3-bracket';
  return (
    <div>
      <h1>This is the 3rd cue.</h1>
      <p>Foreground Background Canvas</p>
      {/* we pass a key value here so that P5Canvas always reloads on a cue change */}
      <DrawingBattleInput ids={ids} key={inputID} bracketID={bracketID} />
    </div>
  );
}

cueHTML[4] = (showUID,uid,user,team) => {
  /* to work on a drawing for the individual user only */
  /* the user uid can simply be added to the unique input id here */
  const teamUID = user.team ? user.team : "unassigned";
  const inputID = `cue3`;
  const ids = {
     userUID: uid,
     teamUID: teamUID,
     inputID: inputID,
     showUID: showUID,
   }
  return (
    <div>
      <h1>This is the 4th cue.</h1>
      <p>Voting</p>
      <VoteInput ids={ids} key={inputID} />
    </div>
  );
}


 cueHTML[5] = (showUID,uid,user,team) => {
  const teamUID = user.team ? user.team : "unassigned";
  const inputID = `cue5`;
  const ids = {
    userUID: uid,
    teamUID: teamUID,
    inputID: inputID,
    showUID: showUID,
  }
  return (
    <div>
      <h1>This is the fifth cue.</h1>
      <p>What's the answer?</p>
      <QuizQuestion key={inputID} ids={ids} />
    </div>
  );
 }

 export default cueHTML;