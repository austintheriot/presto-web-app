import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import config from './util/config';
import { BrowserRouter, Route } from 'react-router-dom';
import Numbers from './components/Numbers';
import Auth from './components/Auth';
import Header from './components/Header';

//Other SDKs:
/* import "firebase/analytics";
import "firebase/functions";
import "firebase/messaging";
import "firebase/storage";
import "firebase/performance";
import "firebase/database";
import "firebase/remote-config"; */

firebase.initializeApp(config);

const db = firebase.firestore();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      numbers: [],
    };
  }

  postRandomNumber() {
    db.collection('tests')
      .add({
        number: Math.random(),
      })
      .then(function (docRef) {
        console.log('Document written with ID: ', docRef.id);
      })
      .catch(function (error) {
        console.error('Error adding document: ', error);
      });
  }

  getAllRandomNumers = () => {
    db.collection('tests')
      .get()
      .then((querySnapshot) => {
        let newNumbers = [];
        querySnapshot.forEach((doc) => {
          newNumbers.push(doc.data().number);
        });
        this.setState({
          numbers: newNumbers,
        });
      });
  };

  updateAuthentication = (user) => {
    if (user) {
      // User is signed in.
      let displayName = user.displayName;
      let email = user.email;
      let emailVerified = user.emailVerified;
      let photoURL = user.photoURL;
      let isAnonymous = user.isAnonymous;
      let uid = user.uid;
      let providerData = user.providerData;
      console.log(
        'User successfully signed in',
        displayName,
        email,
        emailVerified,
        photoURL,
        isAnonymous,
        uid,
        providerData
      );
      this.setState({
        authenticated: true,
      });
      // ...
    } else {
      console.log('User is signed out');
      this.setState({
        authenticated: false,
      });
    }
  };

  componentDidMount() {
    //create event listeners for change in authentication state
    firebase.auth().onAuthStateChanged(this.updateAuthentication);
  }

  render() {
    console.log('rendering');
    return (
      <BrowserRouter>
        <div className='App'>
          <h1>Presto Web App</h1>
          <Header authenticated={this.state.authenticated} />
          <Route path='/' exact component={Auth} />
          <Route
            path='/numbers'
            exact
            component={() => (
              <Numbers
                postClick={this.postRandomNumber}
                getClick={this.getAllRandomNumers}
                allNumbers={this.state.numbers}
              />
            )}
          />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;

//after log in in or signing up, set top-level authenticated: true
//create Sign Out button visible after user is authenticated
//add event listener for when user becomes signed out
//move onAuthStateChanged so that it doesn't trigger an immediate re-render
//move sign out somether else
