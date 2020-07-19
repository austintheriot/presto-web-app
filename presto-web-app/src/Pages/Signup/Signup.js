import React, { useState } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import Modal from '../../components/Modal/Modal';
import returnInputErrors from '../../util/returnInputErrors';
import { Redirect, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import Input from '../../components/Input/Input';
import styles from './Signup.module.css';

//redirect with AuthContext once SetState permeates down to component

export default function Login(props) {
  const [email, setEmail] = useState({
    value: '',
    animateUp: false,
    empty: true,
    touched: false,
    invalid: false,
  });
  const [password, setPassword] = useState({
    value: '',
    animateUp: false,
    empty: true,
    touched: false,
    invalid: false,
  });
  const [confirmPassword, setConfirmPassword] = useState({
    value: '',
    animateUp: false,
    empty: true,
    touched: false,
    invalid: false,
  });

  const [modalMessage, setModalMessage] = useState('');

  const signup = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email.value, password.value)
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

  const handleFocus = (type) => {
    //animation
    switch (type) {
      case 'email':
        setEmail((prevState) => ({ ...prevState, animateUp: true }));
        break;
      case 'password':
        setPassword((prevState) => ({ ...prevState, animateUp: true }));
        break;
      case 'confirmPassword':
        setConfirmPassword((prevState) => ({ ...prevState, animateUp: true }));
        break;
      default:
        return;
    }
  };

  //check for empty fields on blur
  const handleBlur = (type) => {
    //animation
    switch (type) {
      case 'email':
        setEmail((prevState) => ({
          ...prevState,
          animateUp: prevState.empty ? false : true,
        }));
        break;
      case 'password':
        setPassword((prevState) => ({
          ...prevState,
          animateUp: prevState.empty ? false : true,
        }));
        break;
      case 'confirmPassword':
        setConfirmPassword((prevState) => ({
          ...prevState,
          animateUp: prevState.empty ? false : true,
        }));
        break;
      default:
        return;
    }

    //validate
    if (email.touched && email.value.length === 0) {
      setEmail((prevState) => ({ ...prevState, invalid: true }));
      setModalMessage('Email is required');
    }
    if (password.touched && password.value.length === 0) {
      setPassword((prevState) => ({ ...prevState, invalid: true }));
      setModalMessage('Password is required');
    }
    if (confirmPassword.touched && confirmPassword.value.length === 0) {
      setConfirmPassword((prevState) => ({ ...prevState, invalid: true }));
      setModalMessage('Confirm password is required');
    }
  };

  const handleChange = (event, type) => {
    let targetValue = event.target.value;
    switch (type) {
      case 'email':
        setEmail((prevState) => ({
          ...prevState,
          value: targetValue,
          empty: targetValue.length === 0 ? true : false,
        }));
        break;
      case 'password':
        setPassword((prevState) => ({
          ...prevState,
          value: targetValue,
          empty: targetValue.length === 0 ? true : false,
        }));
        break;
      case 'confirmPassword':
        setConfirmPassword((prevState) => ({
          ...prevState,
          value: targetValue,
          empty: targetValue.length === 0 ? true : false,
        }));
        break;
      default:
        return;
    }

    //check for any errors in input
    //return an object so that the input to which it applies can be turned red for invalid
    //give validator the most recent information--substitue a new value for state when the new value is the accurate one
    let validationSettings = {
      email: type === 'email' ? targetValue : email.value,
      password: type === 'password' ? targetValue : password.value,
      confirmPassword:
        type === 'confirmPassword' ? targetValue : confirmPassword.value,
      isSignup: true,
      emailTouched: email.touched,
      passwordTouched: password.touched,
      confirmPasswordTouched: confirmPassword.touched,
    };
    let anyErrorsObject = returnInputErrors(validationSettings);

    //update state to tell input that this input is invalid (turn its styling red)
    anyErrorsObject.email
      ? setEmail((prevState) => ({ ...prevState, invalid: true }))
      : setEmail((prevState) => ({ ...prevState, invalid: false }));
    anyErrorsObject.password
      ? setPassword((prevState) => ({ ...prevState, invalid: true }))
      : setPassword((prevState) => ({ ...prevState, invalid: false }));
    anyErrorsObject.confirmPassword
      ? setConfirmPassword((prevState) => ({ ...prevState, invalid: true }))
      : setConfirmPassword((prevState) => ({ ...prevState, invalid: false }));
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
    if (email.value.length === 0) {
      setEmail((prevState) => ({ ...prevState, invalid: true }));
      setModalMessage('Email is required');
      return;
    } else if (password.value.length === 0) {
      setPassword((prevState) => ({ ...prevState, invalid: true }));
      setModalMessage('Password is required');
      return;
    } else if (confirmPassword.value.length === 0) {
      setConfirmPassword((prevState) => ({ ...prevState, invalid: true }));
      setModalMessage('Confirm password is required');
      return;
    }
    //assuming the email and password are both valid, sign up
    signup();
  };

  let { authenticated } = useAuth();
  let redirect = '/moreinfo1';
  if (props.history?.location?.state?.redirect) {
    redirect = props.history?.location?.state?.redirect;
    console.log('[Signup] will redirect to: ', redirect);
  }

  return (
    //display modal message if redirected from another page requiring authentication:
    <>
      <div className={styles.LoginDiv}>
        <Link to='/login'>Log In</Link>
      </div>
      {authenticated ? <Redirect to={redirect} /> : null}
      {props.history?.location?.state?.modalMessage ? (
        <Modal message={props.history.location.state.modalMessage} />
      ) : null}
      <h1 className={styles.title}>Sign Up</h1>
      <form onSubmit={submitHandler}>
        <Input
          customType='email'
          handleFocus={handleFocus.bind(this, 'email')}
          handleBlur={handleBlur.bind(this, 'email')}
          handleChange={(e) => handleChange(e, 'email')}
          label={'Email*'}
          computedState={email}
        />
        <Input
          customType='password'
          handleFocus={handleFocus.bind(this, 'password')}
          handleBlur={handleBlur.bind(this, 'password')}
          handleChange={(e) => handleChange(e, 'password')}
          label={'Password*'}
          computedState={password}
        />
        <Input
          customType='password'
          handleFocus={handleFocus.bind(this, 'confirmPassword')}
          handleBlur={handleBlur.bind(this, 'confirmPassword')}
          handleChange={(e) => handleChange(e, 'confirmPassword')}
          label={'Confirm Password*'}
          computedState={confirmPassword}
        />
        <Modal
          message={props.modalMessage ? props.modalMessage : modalMessage}
          color={modalMessage ? 'red' : null}
        />
        <div className={styles.buttonsDiv}>
          <Link to='/' className={styles.linkLeft}>
            <img
              className={styles.linkLeftImg}
              src={require('../../assets/images/arrow-left.svg')}
              alt='back'
            />
          </Link>

          <button
            className={styles.linkRight}
            type='submit'
            onClick={submitHandler}>
            <img
              className={styles.linkRightImg}
              src={require('../../assets/images/arrow-right.svg')}
              alt='sign up'
            />
          </button>
        </div>
      </form>
    </>
  );
}
