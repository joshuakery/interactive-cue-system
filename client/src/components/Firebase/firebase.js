import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
// import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import axios from 'axios';

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID,
  };

class Firebase {
    constructor() {
        app.initializeApp(config);

        this.auth = app.auth();
        this.db = app.database();
        console.log(window.location.hostname);
        if (window.location.hostname === "localhost") {
          // Point to the RTDB emulator running on localhost.
          this.db.useEmulator("localhost", 9000);
          // Point to the auth emulator running on localhost.
          this.auth.useEmulator("http://localhost:9099");
        }
        if (window.location.hostname === "192.168.0.15") {
          // Point to the RTDB emulator running on localhost.
          this.db.useEmulator("192.168.0.15", 9000);
          // Point to the auth emulator running on localhost.
          this.auth.useEmulator("http://192.168.0.15:9099");
        }
        
        this.state = {
          showUID: '',
        }
    }

    // *** Auth API ***

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
 
    doPasswordUpdate = password =>
      this.auth.currentUser.updatePassword(password);

    /**
     * From Google's Admin SDK tutorial
     * https://firebase.google.com/docs/auth/admin/custom-claims#javascript
     * 
     * Sets the 'adminStatus' custom claim on the user
     * As a security measure so that only admins may modify cues, users, teams, etc.
     * 
     * Is called in onSubmit of SignIn and SignUp
     *
     */
    doSetCustomClaims = uid => {
        console.log(`Setting custom claims for user: ${uid}`);
        this.user(uid).once('value', snapshot => {
          console.log(`Found user ${uid} in database.`);
          const user = snapshot.val();
          const adminStatus = user.roles.ADMIN;
          
    
          this.auth.currentUser.getIdToken()
          .then(function(idToken) {
            axios.post(
              '../setCustomClaims',
              {
                idToken: idToken,
                adminStatus: adminStatus
              },
              (data, status) => {
                if (status === 'success' && data) {
                  const json = JSON.parse(data);
                  if (json && json.status === 'success') {
                    // Force token refresh. The token claims will contain the additional claims.
                    this.auth.currentUser.getIdToken(true);
                  }
                }
              }
            )      
            .then(() => console.log('User Claims Updated'))
            .catch(error => {
              console.error(error);
            });
          }).catch(function(error) {
            console.log(error);
          });
    
        })
        .catch(function(error) {
          console.log(error);
        });
    }

    /**
     * Helper function to add custom claims to authUser, which is provided as Context in withAuthorization
     */
    getCurrentUserCustomClaims = async () => {
      const idTokenResult = await this.auth.currentUser.getIdTokenResult()
      .catch((error) => {
        console.log(error);
      });
      return idTokenResult.claims;
    }

    // *** Merge Auth and DB User API *** //
 
    /**
     * From Robin Wieruch tutorial
     * https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial
     * 
     * Sets two listeners:
     * (1) onAuthStateChanged, part of Firebase, listens for sign in / sign out
     * (2) on changes to user value in db
     * In either case, updates the authUser for the withAuthorization Context
     * with information about the user's permissions, including custom claims.
     *
     */
    onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
        if (authUser) {
          this.user(authUser.uid)
          //by making this 'on' instead of 'once' we also set a listener for db changes
          //so that we can respond to roles changes in the db
          //even if they haven't come into effect in the custom claims
          //note: in effect, this only helps revoke permission to view the admin page
          //if upgrading a user to admin status, they will have to sign out and in again to make changes
          .on('value', async snapshot => {
            let dbUser = snapshot.val();

            //failsafe in case user was created in Firebase console
            if (!dbUser) {
              console.log('no db user');
              dbUser = {
                username: '',
                email: authUser.email,
                roles: {
                  ADMIN: false,
                },
              }
              this.user(authUser.uid).set(dbUser);
            }

            // default empty roles
            if (!dbUser.roles) {
                dbUser.roles = {};
            }

            //get custom claims set with Admin SDK
            const claims = await this.getCurrentUserCustomClaims();

            // merge auth, custom claims and db user for the callback
            authUser = {
                uid: authUser.uid,
                email: authUser.email,
                claims: claims,
                ...dbUser,
            };

            next(authUser);
          });
        } else {
            fallback();
        }
    });

    // *** User API ***
 
    user = uid => this.db.ref(`users/${uid}`);
    
    users = () => this.db.ref('users');

    // *** Current Show ID API ***

    viewedShowID = () => this.db.ref(`users/${this.auth.currentUser.uid}/show`);

    // *** Show API ***

    shows = () => this.db.ref('shows');

    show = uid => this.db.ref(`shows/${uid}`);

    // *** Current Cue API ***

    currentCue = showUID => this.db.ref(`shows/${showUID}/current_cue`);

    // *** Cues API ***

    cue = (showUID, cueUID) => this.db.ref(`shows/${showUID}/cues/${cueUID}`);

    cues = (showUID) => this.db.ref(`shows/${showUID}/cues`);

    // *** User Input API ***

    bracketVote = (showUID,inputID,round,pair,userUID) =>
      this.db.ref(`shows/${showUID}/userInput/${inputID}/bracket/rounds/${round}/${pair}/votes/${userUID}`);

    bracketVotes = (showUID,inputID,round,pair) =>
      this.db.ref(`shows/${showUID}/userInput/${inputID}/bracket/rounds/${round}/${pair}/votes`);

    bracket = (showUID,inputID) => this.db.ref(`shows/${showUID}/userInput/${inputID}/bracket`);

    currentBattle = (showUID,inputID) =>
      this.db.ref(`shows/${showUID}/userInput/${inputID}/bracket/currentBattle`);

    individualUserInput = (showUID, inputID, teamUID, userUID) =>
      this.db.ref(`shows/${showUID}/userInput/${inputID}/${teamUID}/${userUID}`);

    teamInput = (showUID, inputID, teamUID) =>
      this.db.ref(`shows/${showUID}/userInput/${inputID}/${teamUID}`)

    showWideInput = (showUID, inputID) =>
      this.db.ref(`shows/${showUID}/userInput/${inputID}`);

    allUserInput = (showUID) => this.db.ref(`shows/${showUID}/userInput`);

    // userInput = ids => {
    //   if (ids.userUID)      return this.db.ref(`shows/${ids.showUID}/userInput/${ids.inputID}/${ids.teamUID}/${ids.userUID}`);
    //   else if (ids.teamUID) return this.db.ref(`shows/${ids.showUID}/userInput/${ids.inputID}/${ids.teamUID}`);
    //   else if (ids.inputID) return this.db.ref(`shows/${ids.showUID}/userInput/${ids.inputID}`);
    //   else                  return this.db.ref(`shows/${ids.showUID}/userInput`);
    // }

    // *** Teams API ***

    team = (showUID, teamUID) => this.db.ref(`shows/${showUID}/teams/${teamUID}`);

    teams = (showUID) => this.db.ref(`shows/${showUID}/teams`);

    teamPoints = (showUID, teamUID) => this.db.ref(`shows/${showUID}/teams/${teamUID}/points`);

    // // *** Current Cue API ***

    // currentCue = () => this.db.ref(`shows/${this.state.showUID}/current_cue`);
    
    // // *** Cues API ***

    // cue = uid => this.db.ref(`shows/${this.state.showUID}/cues/${uid}`);

    // cues = showUID => this.db.ref(`shows/${this.state.showUID}/cues`);

    // // *** User Input API ***

    // userInput = id => this.db.ref(`userInput/${id}`);

    // allUserInput = () => this.db.ref('userInput');

    // // *** Teams API ***

    // team = uid => this.db.ref(`teams/${uid}`);

    // teams = () => this.db.ref('teams');

}
   
export default Firebase;

    // // *** Current Show ID API ***

    // currentShowID = () => this.db.ref('current_show_id');

    // // *** Show API ***

    // shows = () => this.db.ref('shows');

    // show = uid => this.db.ref(`shows/${uid}`);

    // // *** Current Cue API ***

    // currentCue = showUID => this.db.ref(`shows/${showUID}/current_cue`);

    // // *** Cues API ***

    // cue = (showUID, cueUID) => this.db.ref(`shows/${showUID}/cues/${cueUID}`);

    // cues = (showUID) => this.db.ref(`shows/${showUID}/cues`);

    // // *** User Input API ***

    // userInput = (showUID, inputID) => this.db.ref(`shows/${showUID}/userInput/${inputID}`);

    // allUserInput = (showUID) => this.db.ref(`shows/${showUID}/userInput`);

    // // *** Teams API ***

    // team = (showUID, teamUID) => this.db.ref(`shows/${showUID}/teams/${teamUID}`);

    // teams = (showUID) => this.db.ref(`shows/${showUID}/teams`);