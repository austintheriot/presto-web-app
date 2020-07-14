import React, { useState } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import Modal from './Modal';
import Auxiliary from './Auxiliary';
import returnInputErrors from '../util/returnInputErrors';
import isNotValid from '../util/isNotValid';
import { Redirect } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

//redirect with AuthContext once SetState permeates down to component

export default function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const login = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((data) => {
        console.log('[Login]: ', data);
      })
      .catch((error) => {
        //account diabled
        if (error.code === 'auth/user-disabled') {
          return setModalMessage(
            'This account corresponding to this email has been disabled'
          );
        }
        //wrong email or password
        else if (
          error.code === 'auth/invalid-email' ||
          error.code === 'auth/wrong-password'
        ) {
          return setModalMessage(
            'The email or password you entered is incorrect'
          );
        }
        //no account
        else if (error.code === 'auth/user-not-found') {
          return setModalMessage(
            'There is no account associated with this email.'
          );
        } else {
          console.error(error.code, error.message);
          setModalMessage('Server error. Please try again later.');
        }
      });
  };

  const inputChangeHandler = (event, type) => {
    //set state
    if (type === 'email') {
      setEmail(event.target.value);
    } else if (type === 'password') {
      setPassword(event.target.value);
    }

    //check for any errors in input (not just newly entered data)
    let anyErrors = returnInputErrors(
      event.target.value,
      type,
      email,
      password,
      null,
      false
    );
    //output input errors on modal
    setModalMessage(anyErrors);
  };

  const submitHandler = (event) => {
    //prevent default form submission
    event.preventDefault();

    //check form inputs one last time
    if (modalMessage) {
      return;
    } else if (isNotValid(email, 'email') || isNotValid(password, 'password')) {
      return setModalMessage(
        isNotValid(email, 'email') || isNotValid(password, 'password')
      );
    }

    //assuming the email and password are both valid, log in
    login();
  };

  let authenticated = useAuth();
  let redirect = '/';
  if (props.history?.location?.state?.redirect) {
    redirect = props.history?.location?.state?.redirect;
    console.log('[Login] will redirect to: ', redirect);
  }

  return (
    //display modal message if redirected from another page requiring authentication:
    <Auxiliary>
      {authenticated ? <Redirect to={redirect} /> : null}
      {props.history?.location?.state?.modalMessage ? (
        <Modal message={props.history.location.state.modalMessage} />
      ) : null}
      <form onSubmit={submitHandler}>
        <label htmlFor='email'>Email*</label>
        <input
          type='email'
          id='email'
          value={email}
          onChange={(e) => inputChangeHandler(e, 'email')}></input>
        <label htmlFor='password'>Password*</label>
        <input
          type='password'
          id='password'
          value={password}
          onChange={(e) => inputChangeHandler(e, 'password')}></input>
        <button onClick={submitHandler} type='submit'>
          Log In
        </button>
      </form>
      <Modal message={props.modalMessage ? props.modalMessage : modalMessage} />
    </Auxiliary>
  );
}
