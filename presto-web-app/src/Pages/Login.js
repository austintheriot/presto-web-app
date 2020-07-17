import React, { useState } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import Modal from '../components/Modal/Modal';
import Auxiliary from '../components/Auxiliary';
import returnInputErrors from '../util/returnInputErrors';
import { Redirect } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';

//redirect with AuthContext once SetState permeates down to component

export default function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const [modalMessage, setModalMessage] = useState('');
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [passwordInvalid, setPasswordInvalid] = useState(false);

  const login = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((data) => {})
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

  const handleFocus = (event, type) => {
    if (type === 'email') setEmailTouched(true);
    if (type === 'password') setPasswordTouched(true);
  };

  //check for empty fields on blur
  const handleBlur = () => {
    if (
      emailTouched &&
      email.length === 0 &&
      passwordTouched &&
      password.length === 0
    ) {
      setEmailInvalid(true);
      setPasswordInvalid(true);
      setModalMessage('Email and password are required');
    } else if (emailTouched && email.length === 0) {
      setEmailInvalid(true);
      setModalMessage('Email is required');
    } else if (passwordTouched && password.length === 0) {
      setPasswordInvalid(true);
      setModalMessage('Password is required');
    }
  };

  const handleChange = (event, type) => {
    //set state
    if (type === 'email') {
      setEmail(event.target.value);
    } else if (type === 'password') {
      setPassword(event.target.value);
    }

    //check for any errors in input
    //return an object so that the input to which it applies can be turned red for invalid
    //give validator the most recent information--substitue a new value for state when the new value is the accurate one
    let validationSettings = {
      email: type === 'email' ? event.target.value : email,
      password: type === 'password' ? event.target.value : password,
      confirmPassword: null,
      isSignup: false,
      emailTouched,
      passwordTouched,
      confirmPasswordTouched: null,
    };
    let anyErrorsObject = returnInputErrors(validationSettings);

    //update state to tell input that this input is invalid (turn its styling red)
    anyErrorsObject.email ? setEmailInvalid(true) : setEmailInvalid(false);
    anyErrorsObject.password
      ? setPasswordInvalid(true)
      : setPasswordInvalid(false);

    //extract any error message that is not null
    let errorMessage = Object.keys(anyErrorsObject)
      .map((key) => anyErrorsObject[key])
      .find((el) => el !== null);

    //display the error message on the modal
    setModalMessage(errorMessage);
  };

  const submitHandler = (event) => {
    //prevent default form submission
    event.preventDefault();

    //check empty form inputs one more time
    if (modalMessage) {
      return;
    }
    if (password.length === 0 && email.length === 0) {
      setEmailInvalid(true);
      setModalMessage('Email and password are required');
      return;
    } else if (email.length === 0) {
      setEmailInvalid(true);
      setModalMessage('Email is required');
      return;
    } else if (password.length === 0) {
      setPasswordInvalid(true);
      setModalMessage('Password is required');
      return;
    }

    //assuming the email and password are both valid, log in
    login();
  };

  let authenticated = useAuth();
  let redirect = '/';
  if (props.history?.location?.state?.redirect) {
    redirect = props.history?.location?.state?.redirect;
    console.log('[Login] will redirect to: ', redirect, ' when finished');
  }

  return (
    //display modal message if redirected from another page requiring authentication:
    <Auxiliary>
      {authenticated ? <Redirect to={redirect} /> : null}
      {props.history?.location?.state?.modalMessage ? (
        <Modal message={props.history.location.state.modalMessage} />
      ) : null}
      <form onSubmit={submitHandler}>
        <Input
          type='email'
          id='email'
          handleFocus={handleFocus}
          handleBlur={handleBlur}
          handleChange={handleChange}
          label={'Email*'}
          invalid={emailInvalid}
        />
        <Input
          type='password'
          id='password'
          handleFocus={handleFocus}
          handleBlur={handleBlur}
          handleChange={handleChange}
          label={'Password*'}
          invalid={passwordInvalid}
        />
        <Modal
          message={props.modalMessage ? props.modalMessage : modalMessage}
          color={modalMessage ? 'red' : null}
        />
        <Button onClick={submitHandler} type='submit'>
          Log In
        </Button>
      </form>
    </Auxiliary>
  );
}
