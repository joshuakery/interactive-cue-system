# interactive-cue-system

**[Live Demo](https://limitless-sands-24279.herokuapp.com/)**

## Overview

During an event or performance, you might want to have an audience visit only one webpage but load a variety of interactions and resources automatically for them. This codebase is for creating a webpage to help you do that.

It includes 4 key features:

1. A list of cues that can be navigated to make changes to a front-facing Home page.
1. Team-assignment for audience members.
1. Web-socket driven drawing canvases so audience members can draw together via socket.io.
1. Admin authorization via the Firebase Admin SDK.

Additionally, this README includes instructions on how to deploy to Heroku.

## Table of Contents

[Requirements](#Requirements)

[Setup](#Setup)

[Deploy with Heroku](#Deploy-with-Heroku)

[How It Works](#How-It-Works)

[Questions](#Questions)

## Requirements

### General Requirements

Node.js, to use React and socket.io

Google Firebase Realtime Database

(To deploy) Heroku account or equivalent

### Knowledge Requirements

**Setup** requires familiarity with using the command line, installing packages with npm, and config variables stored in .env, plus learning to use the Google Firebase Console.

**Use and customization** requires working knowledge of React, including reading JSX.

For simplicity, the audience-facing Home page can be customized using nearly vanilla HTML (wrapped in JSX) and a CSS stylesheet.

**Deploying with Heroku** requires the above, plus learning to deploy with Heroku.


## Setup

1. Download or clone this project from Github (not the demo).
    - Place it in a directory of your choice e.g. Documents/Github/interactive-cue-styem
1. Set up your Google Firebase Realtime Database.
    - If you're new to Firebase, Get Started using a Google Account [here](https://firebase.google.com/)
    - Create a new project from [the Console](https://console.firebase.google.com/)
        - Name of your choice
        - Analytics optional
        - Time zone of your choice
    - Enable Email/Password sign-in.
        - Under Build > Authentication, click Get Started and edit the Sign-in method for Email/Password so that it is **enabled** (but not passwordless sign-in).
    - Create a Realtime Database.
        - Under Build > Realtime Database, click Get Started and set up a new database.
            - Location of your choice.
            - Mode of your choice, we will replace the rules in the next step.
    - Add the rules.json.
        - Under Build > Realtime Database > Rules, Edit rules and replace with the content from rules.json in this repo. Publish.
    - Add a Web App. Under Home, Add App and choose Web.
        - This will show you the config variables for accessing your database through the web. You can find them again under Project Settings > General.
    - Generate a new private key for Firebase Admin SDK. Under Project Settings > Service accounts > Firebase Admin SDK, Generate a new private key. This will trigger a download that we will return to in the next step.
1. Add config variables to the .env files.
    - You will need to create new .env files.
        - On a Mac and new to seeing hidden files that start with `.`? See [here](https://www.ionos.com/digitalguide/server/configuration/showing-hidden-files-on-a-mac/).
        - You can edit an .env using a simple text editor or a code editor like Visual Studio Code.
    - In the top root folder of this project, create a file named ".env". From the same folder, open the .env-example file. Copy and save the variables into your .env and replace the values as follows:
        - GOOGLE_APPLICATION_CREDENTIALS=the entire json of the private key for your Firebase Admin SDK Service Account. Delete the line breaks.
            - Why? For simplicity, I've just decided to store this file as a single line of text, instead of securely storing another file.
        - GOOGLE_DATABASE_URL=the `databaseURL` as it appears in the config variables in Firebase Console under Project Settings > General in the Your apps section.
    - In the client/ folder, create a second .env file. From the same folder, open the .env-example file. Copy and save the variables into your client/.env and replace the values with the config variables in the Firebase Console under Project Settings > General in the Your apps section, as follows:
        - REACT_APP_API_KEY=`apiKey`
        - REACT_APP_AUTH_DOMAIN=`authDomain`
        - REACT_APP_DATABASE_URL=`databaseURL`
        - REACT_APP_PROJECT_ID=`projectId`
        - REACT_APP_STORAGE_BUCKET=`storageBucket`
        - REACT_APP_MESSAGING_SENDER_ID=`messagingSenderId`
        - REACT_APP_APP_ID=`appId`
        - REACT_APP_MEASUREMENT_ID=`measurementId`
1. Create a local build of this project.
    - Open the command line and `cd` to the project directory.
        - New to the command line? It's fun and empowering to use your computer this way! Open it up and follow [this tutorial](https://medium.com/@grace.m.nolan/terminal-for-beginners-e492ba10902a).
    - Make sure node.js and npm are installed. Read [this page](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) for details. The [Node.js download page](https://nodejs.org/en/download/) is a simple download for new learners.
    - Install dependencies for the server. From the top project directory, run `npm install`.
    - `cd client` into the client/ directory and `npm install` client dependencies. This may take a few minutes.
    - Run the project to see if it's working. This requires two simultaneous command line processes.
        - In one command line window, `cd` to the top root folder and run `npm start`.
        - In a new command line window, `cd` to the client/ folder and run `npm start`.
        - This should open up a webpage in one of your Internet browsers like Chrome. After some initialization, you should see a 'Sign In' button appear in the top left corner.
    - When need be, terminate these processes with Control+C on Mac
1. With the local build running, sign up in the app.
    - Navigate to 'Sign In' and then to 'Sign Up'.
    - Complete and submit the form.
    - Why? This form creates a new authenticated user in the Firebase Console (that's the Email/Password sign-in you enabled) AND it creates an entry into the Realtime Database for your information.
    - You should see your new user information appear under both the Console's Authentication > Users tab and its Realtime Database > Data tab. In the app, you should see a Home screen with a 'Sign Out' button in the top right corner.
1. Tricky part. You need to manually change your roles in the Realtime Database to `ADMIN: true`.
    - Why? So that the Firebase Admin SDK will set your `admin` custom claims to be true. I've designed it to check your ADMIN status in the database and adjust your custom claims permissions based on that.
        - Why this way? I didn't design another way to do this securely because you only need to do it once. After this, any admin can change the admin status of any other admin.
    - How?
        - Click down in your Realtime Database until you're at $your-name-rtdb > users > $uid > roles > ADMIN.
        - From the right-hand side 3-dots menu, Export JSON.
        - In a text-editor, open this file and replace `false` with `true`.
        - Back in the Console, from the same right-hand side 3-dots menu, Import JSON and re-import this file. This should replace the ADMIN value in the database.
1. In the local build of the app running from the command line, Sign Out and Sign In again.
    - **BUG** *No admin menu. To resolve, you may need to sign in, and navigate to the sign-in page again and sign in a second time.*
    - When you sign in again, the app will check your ADMIN status in the Realtime Database and send a message to the server index.js to use the Firebase Admin SDK to update your custom claims accordingly.
    - You should now be authorized by the Admin SDK and you should see a menu with 'ADMIN' and 'HOME' options.

Questions? I want to get better at writing instructions. Please email me at joshuakery1@gmail.com.

## Deploy with Heroku

Heroku also has this process well documented [here](https://devcenter.heroku.com/articles/getting-started-with-nodejs?singlepage=true), including adding the config variables.

1. Track your project with Git.
    - Heroku uses Git to manage deploys.
    - Make sure you have Git installed on your machine. See [here](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).
        - New to Git? Read about it [here](https://www.freecodecamp.org/news/what-is-git-and-how-to-use-it-c341b049ae61/#:~:text=Git%20is%20an%20Open%20Source%20Distributed%20Version%20Control%20System.&text=So%20Git%20can%20be%20used,can%20add%20code%20in%20parallel.).
    - From the command line, from your project top root folder, `git init`
    - `git add .` to stage all our files to be committed.
        - Use `git status` to confirm that your .env files will not be committed. The .gitignore file should have been copied with this project, and should earmark the .env to be skipped.
            - New to .gitignore? Read about it [here](https://www.freecodecamp.org/news/gitignore-what-is-it-and-how-to-add-to-repo/).
    - `git commit -m "First Commit"` to commit these files.
1. Create a Heroku app.
    - Make sure you have the Heroku Command-Line-Interface setup and you're logged in on your machine. To do this, see [this page](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up).
    - From your top root folder, `heroku create`. This creates a project on Heroku, which will host a small app like this for free.
1. Add the config variables in Heroku.
    - For each variable from *both* .env files you configured earlier, run `heroku config:set VARIABLE=value`.
    - Run `heroku config` to see the variables set so far.
1. Push everything else to heroku from the command line.
    - Push the files to Heroku with `git push heroku main`. This will take a minute or two to complete, because Heroku will now install the project's dependencies.
    - Make sure it's running with `heroku ps:scale web=1`
    - Open it in your web browser with `heroku open`
    - **BUG** *Blank screen. The error in the browser console I've been getting is something like "k - API key not properly copied." To resolve, you may need to make a second push to heroku for your variables to take effect and the Firebase Admin SDK to setup properly.*

### Additional Resources

[Heroku: Web Sockets & Heroku](https://devcenter.heroku.com/articles/node-websockets)

[Dave Ceddia: React, Express & Heroku](https://daveceddia.com/deploy-react-express-app-heroku/)

[Evgeny: React, socket.io & Heroku](https://eugrdn.me/blog/react-socketio-heroku/)

## How It Works

The Routing and React Context structure of this app was built following [Robin Wieruch's tutorial](https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial). For more details, see client/index.js

This app is built to run from a single command line process on Heroku, so that you needn't maintain a server and a client app. Thus, in the package.json of the top root folder, a `heroku-postbuild` script has been defined to start up the React app after starting the server. See [Dave Ceddia's tutorial](https://daveceddia.com/deploy-react-express-app-heroku/) for more details.

### A list of cues that can be navigated to make changes to a front-facing Home page.

In order to trigger changes to an audience member's webpage in real time, this system stores a list of cues and a current cue in Firebase.

On the Admin Page, admins can make changes to the cues and current cue that are stored in Firebase.

The Home Page uses Firebase's event listeners to respond to changes to the database and change the HTML and interactive elements that it displays. All users see HTML and interactive elements displayed depending on the current cue, their team, and their user info. These HTML and interactive elements are defined in src/components/Home/cueHTML.js

### Team-assignment for audience members.

In order to create groups of users and display content conditionally depending on their group assignment, teams are also stored in Firebase.

Metadata about each team is stored in a "teams" node of the database, and then each user may or may not have a "team" assignment node as part of their personal data. Users without teams are sorted into the "unassigned" team as a default.

The Home Page Component loads the user's team on mount. Like for changes to the current cue, it also listens for changes to the user and their team, so that admins can reassign users to teams on the fly and have their changes appear immediately.

### Web-socket driven drawing canvases so audience members can draw together via socket.io.

In order to highlight the potential for real-time interactions using web sockets in this app, I created a simple real-time drawing interface.

This is one of two main uses of the server index.js in the top root folder. This server relays socket input from clients to all other clients connected in the app, as appropriate.

The drawing interface uses socket.io rooms so we can have communcation just between team members. The P5Canvas Component accepts an input ID, which determines what socket.io room for the user to join and which node in Firebase to store the data for this drawing. For solo canvases, a user joins a room all to themself.

This drawing interface uses the p5js library and follows [a tutorial by Christian Kastner](https://dev.to/christiankastner/integrating-p5-js-with-react-i0d).

#### Future Considerations

The 'inputID' node of the Firebase Realtime Database could be extended to accept not just drawing data, but also user responses to survey questions, points scored for a quiz, locations chosen on a map, etc.

Web sockets could be extended to more elaborate real-time puzzle games and drawing exercises.

### Admin authorization via the Firebase Admin SDK.

In order to better secure the read and write rules of the Firebase Realtime Database, I used the Firebase Admin SDK to set custom claims on authenticated users.

This is the other of the two main uses of the server index.js in the top root folder. The server responds to POST requests to "/setCustomClaims" to set the custom claims of the given user based on their ADMIN status in the Realtime Database.

For more information, visit [here](https://firebase.google.com/docs/auth/admin/custom-claims).

## Questions

Questions? I want to get better at writing instructions. Please email me at joshuakery1@gmail.com.