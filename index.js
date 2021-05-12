/**
 * This document sets up our
 * express server,
 * web sockets with socket.io, and
 * Google Admin SDK
 * 
 * 
 * Additional resources for installing dependencies for Heroku:
 * 
 * Heroku: Web Sockets & Heroku
 * https://devcenter.heroku.com/articles/node-websockets
 * 
 * Dave Ceddia: React, Express & Heroku
 * https://daveceddia.com/deploy-react-express-app-heroku/
 * 
 * Evgeny: React, socket.io & Heroku
 * https://eugrdn.me/blog/react-socketio-heroku/
 * 
 */

/* Includes for express server */
const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
/* Includes for socket.io */
const io = require('socket.io')(server);
const port = process.env.PORT || 5000;
/* Includes for dotenv, necessary for some reason with Admin SDK variables */
const dotenv = require('dotenv');
dotenv.config();
/* Includes for Google Admin SDK */
const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

/* Google Admin SDK initialization */
/* https://firebase.google.com/docs/admin/setup */
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.GOOGLE_DATABASE_URL,
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


/* Backend implementation (Google Admin SDK) */
/* https://firebase.google.com/docs/auth/admin/custom-claims */
app.post('/setCustomClaims', (req, res) => {
  // Get the ID token passed.
  const idToken = req.body.idToken;
  const adminStatus = req.body.adminStatus;
  // Verify the ID token and decode its payload.
  admin.auth().verifyIdToken(idToken).then((claims) => {
    // Verify user is eligible for additional privileges.
    if (typeof claims.email !== 'undefined') {
      // Add custom claims for additional privileges.
      admin.auth().setCustomUserClaims(claims.sub, {
        admin: adminStatus
      })
      .then(function() {
        console.log('Claims updated to ' + adminStatus);
        // Tell client to refresh token on user.
        res.end(JSON.stringify({
          status: 'success'
        }));
      });
    } else {
      // Return nothing.
      res.end(JSON.stringify({status: 'ineligible'}));
    }
  });
});

/**
 * This code lets our socket server and front-end React app
 * sit on the same machine, which is just one option for having
 * a socket server like this.
 * 
 * Following Dave Ceddia's tutorial:
 * https://daveceddia.com/deploy-react-express-app-heroku/
 * 
 */
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
  });

/* regular socket.io use */
io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('joinroom', data => {
      const { room } = data;
      socket.join(room);
    });
    socket.on('leaveroom', data => {
      const { room } = data;
      socket.leave(room);
    });
    socket.on('mousemove', (data) => {
      const { room } = data;
      socket.to(room).emit('moving', data);
    });
    socket.on('disconnect', () => console.log('Client disconnected'));
  });

  
server.listen(port, () => console.log(`Listening on ${port}`));















