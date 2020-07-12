import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import config from './util/config';

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
      <div className='App'>
        <header>
          <nav>
            <ul>
              <li>
                <a href='/example1'>Example 1</a>
              </li>
              <li>
                <a href='/example2'>Example 2</a>
              </li>
            </ul>
          </nav>
        </header>
        <h1>Presto Web App</h1>

        {this.state.authenticated ? (
          <div>
            <button onClick={this.postRandomNumber}>
              Post a Random Number
            </button>
            <button onClick={this.getAllRandomNumers}>
              Get All Random Numbers
            </button>
            <p>{this.state.numbers}</p>
          </div>
        ) : (
          <p>Please login to use the random number generator.</p>
        )}
      </div>
    );
  }
}

export default App;
