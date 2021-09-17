import P5Canvas from './p5canvas';

/* CSS styles are included as a simple stylesheet for easy editing for those new to React */
import "./style.css";

/**
 * This is how we define what HTML to show to the audience.
 * 
 * Without creating a GUI, this seems like a simple way for someone new to React
 * to define cues using JSX, with mostly vanilla HTML syntax
 *
 */
 const cueHTML = {};

 cueHTML[1] = (uid,user,team) => {
   /* to create a team drawing */
   /* the team uid can simply be added to the unique input id here */
   const teamUID = user.team ? user.team : "unassigned";
   const inputID = 'cue1' + teamUID;
   return (
     <div>
       <h1 className="cue1-header">This is the first cue.</h1>
       <p>This drawing canvas is shared with the user's team!</p>
       {/* we pass a key value here so that P5Canvas always reloads on a cue change */}
       <P5Canvas key={inputID} userUID={uid} inputID={inputID}></P5Canvas>
     </div>
   );
 }
 
 cueHTML[2] = (uid,user,team) => {
   /* to work on a drawing for the individual user only */
   /* the user uid can simply be added to the unique input id here */
   const inputID = 'cue2' + uid;
   return (
     <div>
       <h1>This is the second cue.</h1>
       <p>This drawing canvas is just for this user!</p>
       {/* we pass a key value here so that P5Canvas always reloads on a cue change */}
       <P5Canvas key={inputID} userUID={uid} inputID={inputID}></P5Canvas>
     </div>
   );
 }
 
 /* we can assign the same cue to multiple cue numbers */
 cueHTML[3] = cueHTML[4] = (uid,user,team) => {
   /* to create a show-wide drawing */
   /* all users will share the unique input id here */
   const inputID = 'cue3';
   return (
     <div>
       <h1>This is the third and fourth cue!</h1>
       <p>This drawing canvas is shared with all users!</p>
       {/* we pass a key value here so that P5Canvas always reloads on a cue change */}
       <P5Canvas key={inputID} userUID={uid} inputID={inputID}></P5Canvas>
     </div>
   );
 }

 export default cueHTML;