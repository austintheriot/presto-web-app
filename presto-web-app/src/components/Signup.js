import React, { useState } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import Modal from './Modal';
import Auxiliary from './Auxiliary';
import returnAnySignupInputErrors from '../util/returnAnySignupInputErrors';
import isNotValid from '../util/isNotValid';

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const inputChangeHandler = (event, type) => {
    //set state
    if (type === 'email') {
      setEmail(event.target.value);
    } else if (type === 'password') {
      setPassword(event.target.value);
    } else if (type === 'confirmPassword') {
      setConfirmPassword(event.target.value);
    }

    //check for any errors in input (not just newly entered data)
    let anyErrors = returnAnySignupInputErrors(
      event.target.value,
      type,
      email,
      password,
      confirmPassword
    );
    //output input errors on modal
    setModalMessage(anyErrors);
  };

  const submitHandler = (event, type) => {
    event.preventDefault();
    if (modalMessage) {
      return;
    } else if (
      isNotValid(email, 'email') ||
      isNotValid(password, 'password') ||
      isNotValid(confirmPassword, 'confirmPassword')
    ) {
      return setModalMessage(
        isNotValid(email, 'email') ||
          isNotValid(password, 'password') ||
          isNotValid(confirmPassword, 'confirmPassword')
      );
    }

    //assuming the email and password are both valid:
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((data) => {})
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          return setModalMessage('Email already in use');
        }
        if (error.code === 'auth/invalid-email') {
          return setModalMessage('Invalid email');
        }
        if (error.code === 'auth/weak-password') {
          return setModalMessage('Password not strong enough');
        } else {
          console.error(modalMessage);
          return setModalMessage(
            'Sorry, there was an error. Please try again later.'
          );
        }
      });
  };

  return (
    <Auxiliary>
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
        <label htmlFor='confirmPassword'>Confirm Password*</label>
        <input
          type='password'
          id='confirmPassword'
          value={confirmPassword}
          onChange={(e) => inputChangeHandler(e, 'confirmPassword')}></input>
        <button onClick={submitHandler} type='submit'>
          Signup
        </button>
      </form>
      <Modal message={modalMessage} />
    </Auxiliary>
  );
};
