import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import config from './util/config';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Nothing from './components/Nothing';
import Numbers from './components/Numbers';

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
  constructor() {
    super();
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

  componentDidMount() {}

  render() {
    return (
      <BrowserRouter>
        <div className='App'>
          <header>
            <nav>
              <ul>
                <li>
                  <Link to='/'>Show Nothing</Link>
                </li>
                <li>
                  <Link to='/numbers'>Show Numbers</Link>
                </li>
                <li>
                  <Link to='/auth'>Login</Link>
                </li>
              </ul>
            </nav>
          </header>
          <h1>Presto Web App</h1>
          <Route path='/' exact component={Nothing} />
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
