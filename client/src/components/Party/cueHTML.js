import TeamLeaderboard from './teamLeaderboard';
import QuizAnswers from './quizAnswers';
import TeamPointsDisplay from './teamPointsDisplay';
import DrawingBattle from './drawingBattle';

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

 cueHTML[1] = (showUID) => {
  const ids = {
    showUID:showUID,
    goalsID:'gamified-leaderboard',
  }
  return (
    <div>
      <h1>This is the first cue.</h1>
      <TeamLeaderboard ids={ids} />
    </div>
  );
 }

 cueHTML[4] = (showUID) => {
  const inputID = `cue3`;
  const ids = {
    showUID:showUID,
    inputID:inputID
  }
  return (
    <div>
      <h1>This is the fourth cue.</h1>
      <DrawingBattle ids={ids} />
    </div>
  );
 }

 cueHTML[5] = (showUID) => {
  const inputID = `cue5`;
  return (
    <div>
      <h1>This is the fifth cue.</h1>
      <p>What's the answer?</p>
      <QuizAnswers showUID={showUID} inputID={inputID} />
    </div>
  );
 }

 cueHTML[6] = (showUID) => {
  const inputID = `cue5`;
  return (
    <div>
      <h1>This is the sixth cue.</h1>
      <p>Team Points</p>
      <TeamPointsDisplay showUID={showUID} />
    </div>
  );
 }

 export default cueHTML;