import React, { useState, useEffect } from 'react';
import './App.css';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import config from './util/config';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Admin from './components/Admin';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import { AuthContext } from './context/auth';

//Other SDKs:
/* import "firebase/analytics";
import "firebase/functions";
import "firebase/messaging";
import "firebase/storage";
import "firebase/performance";
import "firebase/database";
import "firebase/remote-config"; */

firebase.initializeApp(config);

/* const db = firebase.firestore(); */

const App = () => {
  const [authenticated, setAuthentication] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [userUid, setUserUid] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [userDisplayName, setUserDisplayName] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [userEmail, setUserEmail] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [userEmailVerified, setUserEmailVerified] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [userPhotoUrl, setUserPhotoUrl] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [isAnonymous, setIsAnonymous] = useState(null);

  const updateAuthentication = (user) => {
    if (user) {
      // User is signed in.
      setAuthentication(true);
      setUserDisplayName(user.displayName);
      setUserEmail(user.email);
      setUserEmailVerified(user.emailVerified);
      setUserPhotoUrl(user.photoURL);
      setIsAnonymous(user.isAnonymous);
      setUserUid(user.uid);
      console.log('User successfully signed in');
    } else {
      setAuthentication(false);
      console.log('User is signed out');
    }
  };

  firebase.auth().onAuthStateChanged(updateAuthentication);

  useEffect(() => {
    console.log('App.js rendered');
  });

  return (
    <AuthContext.Provider value={authenticated}>
      <Router>
        <div className='App'>
          <h1>Presto Web App</h1>
          <h2>
            The user is currently{' '}
            {authenticated ? 'authenticated' : 'not authenticated.'}
          </h2>
          <Header authenticated={authenticated} />
          <Route exact path='/' component={Home} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/signup' component={Signup} />
          <PrivateRoute exact path='/admin' component={Admin} />
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
/* 
Goals For This Authentication System

Private and public routes: This application will have basic “landing” pages, which any user can visit. Along with these, signing up and logging in should be declarative public routes. On the other hand there will be many pages that require authentication to view.
Redirect to Login: If the user does not have tokens, or the token refresh does not work, the user will automatically be redirected to the Login page if they attempt to see a private route.
Redirect to referrer: If a user wants to view a specific page, but does not have a valid token, they will be redirected to the login page. We want to make sure that after logging in they’re sent to the page they originally wanted. The default will be the dashboard.
Authentication Tokens: We’ll use tokens to read and write authentication with. These should be stored in local storage so the user can stay logged in if they leave the site.
UI is intuitive and straightforward: This really isn’t going to be much of an “examination” on the UI aspect, but I do think it’s essential for our Login and Sign up page to be simple, and follow the do’s and don’ts outlined by Brad Frost here. 
*/

//make a private route & a public route
//after log in in or signing up, set top-level authenticated: true
//create Sign Out button visible after user is authenticated
//add event listener for when user becomes signed out
//move onAuthStateChanged so that it doesn't trigger an immediate re-render
//move sign out somether else
//make sure all stored user data is actually being used (get rid of unused variables)
