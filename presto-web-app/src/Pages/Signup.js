import React, { useState } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import Modal from '../components/Modal/Modal';
import returnInputErrors from '../util/returnInputErrors';
import { Redirect } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';

//redirect with AuthContext once SetState permeates down to component

export default function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  const [modalMessage, setModalMessage] = useState('');
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [confirmPasswordInvalid, setConfirmPasswordInvalid] = useState(false);

  const signup = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((data) => {})
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use')
          return setModalMessage('Email already in use');
        else if (error.code === 'auth/invalid-email')
          return setModalMessage('Invalid email');
        else if (error.code === 'auth/weak-password')
          return setModalMessage('Password not strong enough');
        else {
          console.error(error.code, error.message);
          setModalMessage('Sorry, there was an error. Please try again later.');
        }
      });
  };

  const handleFocus = (event, type) => {
    if (type === 'email') setEmailTouched(true);
    if (type === 'password') setPasswordTouched(true);
    if (type === 'confirmPassword') setConfirmPasswordTouched(true);
  };

  //check for empty fields on blur
  const handleBlur = () => {
    if (emailTouched && email.length === 0) {
      setEmailInvalid(true);
      setModalMessage('Email is required');
    }
    if (passwordTouched && password.length === 0) {
      setPasswordInvalid(true);
      setModalMessage('Password is required');
    }
    if (confirmPasswordTouched && confirmPassword.length === 0) {
      setConfirmPasswordInvalid(true);
      setModalMessage('Confirm password is required');
    }
  };

  const handleChange = (event, type) => {
    //set state
    if (type === 'email') {
      setEmail(event.target.value);
    } else if (type === 'password') {
      setPassword(event.target.value);
    } else if (type === 'confirmPassword') {
      setConfirmPassword(event.target.value);
    }

    //check for any errors in input
    //return an object so that the input to which it applies can be turned red for invalid
    //give validator the most recent information--substitue a new value for state when the new value is the accurate one
    let validationSettings = {
      email: type === 'email' ? event.target.value : email,
      password: type === 'password' ? event.target.value : password,
      confirmPassword:
        type === 'confirmPassword' ? event.target.value : confirmPassword,
      isSignup: true,
      emailTouched,
      passwordTouched,
      confirmPasswordTouched,
    };
    let anyErrorsObject = returnInputErrors(validationSettings);

    //update state to tell input that this input is invalid (turn its styling red)
    anyErrorsObject.email ? setEmailInvalid(true) : setEmailInvalid(false);
    anyErrorsObject.password
      ? setPasswordInvalid(true)
      : setPasswordInvalid(false);
    anyErrorsObject.confirmPassword
      ? setConfirmPasswordInvalid(true)
      : setConfirmPasswordInvalid(false);
    //extract any error message that is not null
    let errorMessage = Object.keys(anyErrorsObject)
      .map((key) => anyErrorsObject[key])
      .find((el) => el !== null);

    //display the error message on the modal
    setModalMessage(errorMessage);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    //no submission allowed until all input errors are cleared
    if (modalMessage) {
      return;
    }
    if (email.length === 0) {
      setEmailInvalid(true);
      setModalMessage('Email is required');
      return;
    } else if (password.length === 0) {
      setPasswordInvalid(true);
      setModalMessage('Password is required');
      return;
    } else if (confirmPassword.length === 0) {
      setConfirmPasswordInvalid(true);
      setModalMessage('Confirm password is required');
      return;
    }
    //assuming the email and password are both valid, sign up
    signup();
  };

  let { authenticated } = useAuth();
  let redirect = '/';
  if (props.history?.location?.state?.redirect) {
    redirect = props.history?.location?.state?.redirect;
    console.log('[Signup] will redirect to: ', redirect);
  }

  return (
    //display modal message if redirected from another page requiring authentication:
    <React.Fragment>
      {authenticated ? <Redirect to={redirect} /> : null}
      {props.history?.location?.state?.modalMessage ? (
        <Modal message={props.history.location.state.modalMessage} />
      ) : null}
      <h1>Sign Up</h1>
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
        <Input
          type='password'
          validationType='confirmPassword'
          id='password'
          handleFocus={handleFocus}
          handleBlur={handleBlur}
          handleChange={handleChange}
          label={'Confirm Password*'}
          invalid={confirmPasswordInvalid}
        />
        <Modal
          message={props.modalMessage ? props.modalMessage : modalMessage}
          color={modalMessage ? 'red' : null}
        />
        <Button onClick={submitHandler} type='submit'>
          <p>Log In</p>
        </Button>
      </form>
    </React.Fragment>
  );
}
