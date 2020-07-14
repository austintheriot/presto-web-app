import React, { useState, useEffect } from 'react';
import { firebaseAuth } from './util/config';

//pages
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Protected from './components/Protected';

//components
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
} from 'react-router-dom';

//context
import { AuthContext } from './context/AuthProvider';

//styling
import './App.css';

//Other SDKs:
/* import "firebase/analytics";
import "firebase/functions";
import "firebase/messaging";
import "firebase/storage";
import "firebase/performance";
import "firebase/database";
import "firebase/remote-config"; */

/* const db = firebase.firestore(); */

function App() {
  const [user, setUser] = useState(false);

  useEffect(() => {
    authListener();
  }, []);

  function authListener() {
    firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        console.log('[App]: user logged in');
        setUser({
          authenticated: true,
          email: user.email,
          uid: user.uid,
          displayName: user.displayName,
          emailVerified: user.emailVerified,
          photoUrl: user.photoURL,
          isAnonymous: user.isAnonymous,
        });
      } else {
        setUser({
          authenticated: false,
          email: null,
          uid: null,
          displayName: null,
          emailVerified: null,
          photoUrl: null,
          isAnonymous: null,
        });
      }
    });
    //second argument here causes to never run again (since the array doesn't change)
  }

  return (
    <AuthContext.Provider value={user.authenticated}>
      <Router>
        <div className='App'>
          <h1>Presto Web App</h1>
          <Header />
          <Switch>
            <Route exact path='/' component={Home}></Route>
            <Route path='/login' component={Login} />
            <Route path='/signup' component={Signup} />
            <PrivateRoute path='/protected' component={Protected} />
            <Route path='*' component={Home}></Route>
          </Switch>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

//wrapping the App in a higher order component
//to access redirect props in Login component
//display messages like: please log in to see this page
const AppWithRouter = withRouter(App);

//surrounding app with Router
const AppContainer = () => {
  return (
    <Router>
      <AppWithRouter />
    </Router>
  );
};

export default AppContainer;

//MAJOR TO-DOs:
//create app game plan & design
//allow more user information at signup - username?
//create user document on signup with default photo
//enable updating user info and their doc
//implement datase security measures (only accessing uid of logged in user)

//Minor/General/Optimization TO-DOs:
//prevent flash of the not-logged-in screen before login in user

//when redirected to log in, redirect back to the page that was left--
//currently, the page is redirecting before the promise is complete?
//--or before the state has updated to let the browser know the user is logged in
//currently fixed by adding a second interval... but this isn't good
