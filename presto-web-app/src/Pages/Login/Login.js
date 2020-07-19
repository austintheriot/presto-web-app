import React, { useState } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import Modal from '../../components/Modal/Modal';
import returnInputErrors from '../../util/returnInputErrors';
import { Redirect, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import Input from '../../components/Input/Input';
import styles from './Login.module.css';

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

  const [modalMessage, setModalMessage] = useState('');

  const login = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email.value, password.value)
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

  const handleFocus = (type) => {
    //animation
    switch (type) {
      case 'email':
        setEmail((prevState) => ({ ...prevState, animateUp: true }));
        break;
      case 'password':
        setPassword((prevState) => ({ ...prevState, animateUp: true }));
        break;
      default:
        return;
    }

    //validation
    if (type === 'email')
      setEmail((prevState) => ({
        ...prevState,
        touched: true,
      }));
    if (type === 'password')
      setPassword((prevState) => ({
        ...prevState,
        touched: true,
      }));
  };

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
      default:
        return;
    }

    //check for empty fields on blur
    if (
      email.touched &&
      email.value.length === 0 &&
      password.touched &&
      password.value.length === 0
    ) {
      setEmail((prevState) => ({
        ...prevState,
        invalid: true,
      }));
      setPassword((prevState) => ({
        ...prevState,
        touched: true,
      }));
      setModalMessage('Email and password are required');
    } else if (email.touched && email.value.length === 0) {
      setEmail((prevState) => ({
        ...prevState,
        invalid: true,
      }));
      setModalMessage('Email is required');
    } else if (password.touched && password.value.length === 0) {
      setPassword((prevState) => ({
        ...prevState,
        touched: true,
      }));
      setModalMessage('Password is required');
    }
  };

  const handleChange = (event, type) => {
    let targetValue = event.target.value;
    //set state
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
      default:
        return;
    }

    //check for any errors in input
    //return an object so that the input to which it applies can be turned red for invalid
    //give validator the most recent information--substitue a new value for state when the new value is the accurate one
    let validationSettings = {
      email: type === 'email' ? targetValue : email.value,
      password: type === 'password' ? targetValue : password.value,
      confirmPassword: null,
      isSignup: false,
      emailTouched: email.touched,
      passwordTouched: password.touched,
      confirmPasswordTouched: null,
    };
    let anyErrorsObject = returnInputErrors(validationSettings);

    //update state to tell input that this input is invalid (turn its styling red)
    anyErrorsObject.email
      ? setEmail((prevState) => ({
          ...prevState,
          invalid: true,
        }))
      : setEmail((prevState) => ({
          ...prevState,
          invalid: false,
        }));
    anyErrorsObject.password
      ? setPassword((prevState) => ({
          ...prevState,
          invalid: true,
        }))
      : setPassword((prevState) => ({
          ...prevState,
          invalid: false,
        }));

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
    if (password.value.length === 0 && email.value.length === 0) {
      setEmail((prevState) => ({
        ...prevState,
        invalid: true,
      }));
      setModalMessage('Email and password are required');
      return;
    } else if (email.value.length === 0) {
      setEmail((prevState) => ({
        ...prevState,
        invalid: true,
      }));
      setModalMessage('Email is required');
      return;
    } else if (password.value.length === 0) {
      setPassword((prevState) => ({
        ...prevState,
        invalid: true,
      }));
      setModalMessage('Password is required');
      return;
    }

    //assuming the email and password are both valid, log in
    login();
  };

  let { authenticated } = useAuth();
  let redirect = '/home';
  if (props.history?.location?.state?.redirect) {
    redirect = props.history?.location?.state?.redirect;
    console.log('[Login] will redirect to: ', redirect, ' when finished');
  }

  //top modal:
  let infoMessage = props.history?.location?.state?.infoMessage;

  return (
    //display modal message if redirected from another page requiring authentication:
    <>
      <div className={styles.SignupDiv}>
        <Link to='/signup'>Sign Up</Link>
      </div>
      {authenticated ? <Redirect to={redirect} /> : null}

      <h1 className={styles.title}>Log In</h1>
      {infoMessage ? <Modal message={infoMessage} color='black' /> : null}
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
