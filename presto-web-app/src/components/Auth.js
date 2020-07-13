import React, { Component } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import Modal from './Modal';
import Auxiliary from './Auxiliary';
import isNotValid from '../util/isNotValid';

class Auth extends Component {
  state = {
    email: '',
    password: '',
    modalMessage: '',
  };

  inputChangeHandler = (event, value) => {
    this.setState({ [value]: event.target.value });

    //authenticate the text as they type
    //check for valid email
    let modalMessage = isNotValid(event.target.value, value);
    if (modalMessage) {
      this.setState({
        modalMessage,
      });
      return;
    }
    //check for valid password
    modalMessage = isNotValid(event.target.value, value);
    if (modalMessage) {
      this.setState({
        modalMessage,
      });
      return;
    } else {
      modalMessage = null;
      this.setState({
        modalMessage,
      });
      return;
    }
  };

  submitHandler = (event, type) => {
    event.preventDefault();
    if (type === 'signout') {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.setState({
            modalMessage: 'Successfully signed out',
          });
        })
        .catch((error) => {
          modalMessage = error.message;
          console.error(modalMessage);
          this.setState({
            modalMessage,
          });
        });
    }

    ///////////////////if not signing out:
    //check for valid email
    let modalMessage = isNotValid(this.state.email, 'email');
    if (modalMessage) {
      this.setState({
        modalMessage,
      });
      return;
    }
    //check for valid password
    modalMessage = isNotValid(this.state.password, 'password');
    if (modalMessage) {
      this.setState({
        modalMessage,
      });
      return;
    }

    //assuming the email and password are both valid:
    if (type === 'signup') {
      //process form as a sign up
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((data) => {
          this.setState({
            modalMessage: '',
          });
        })
        .catch((error) => {
          if (error.code === 'auth/email-already-in-use') {
            modalMessage = 'This email is already in use';
          } else if (error.code === 'auth/invalid-email') {
            modalMessage = 'This email address is not valid';
          } else if (error.code === 'auth/weak-password') {
            modalMessage = 'This password is not strong enough';
          }
          console.error(modalMessage);
          this.setState({
            modalMessage,
          });
        });
    } else {
      //process form as a log in (by default)
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((data) => {
          this.setState({
            modalMessage: '',
          });
        })
        .catch((error) => {
          if (error.code === 'auth/user-disabled') {
            modalMessage =
              'This account corresponding to this email has been disabled';
          } else {
            modalMessage = 'The email or password you entered is incorrect';
          }
          console.error(modalMessage);
          this.setState({
            modalMessage,
          });
        });
    }
  };

  render() {
    return (
      <Auxiliary>
        <form onSubmit={this.submitHandler}>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            value={this.state.email}
            onChange={(e) => this.inputChangeHandler(e, 'email')}></input>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            onChange={(e) => this.inputChangeHandler(e, 'password')}></input>
          <button onClick={(e) => this.submitHandler(e, 'login')} type='submit'>
            Log In
          </button>
          <button
            onClick={(e) => this.submitHandler(e, 'signup')}
            type='submit'>
            Signup
          </button>
          <button
            onClick={(e) => this.submitHandler(e, 'signout')}
            type='submit'>
            Signout
          </button>
        </form>
        <Modal message={this.state.modalMessage} />
      </Auxiliary>
    );
  }
}

export default Auth;
