/**
 * The setup for this app follows closely Robin Wieruch's tutorial
 * https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial
 * 
 * which breaks up the pages of the app into different components
 * with firebase access provided as React context
 * 
 * the web socket and the Material UI theme are also provided as React context
 * 
 * two methods, withAuthentication and withAuthorization, are frequently used
 * to check if a user has access to a given component
 * and routes them away if not
 *
 */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import Firebase, { FirebaseContext } from './components/Firebase';
import Socket, { SocketContext } from './components/Socket';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <FirebaseContext.Provider value={new Firebase()}>
      <SocketContext.Provider value={new Socket()}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </SocketContext.Provider>
    </FirebaseContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
