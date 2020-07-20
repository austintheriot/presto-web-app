import React, { useState, useEffect } from 'react';
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
  const [state, setState] = useState({
    inputs: {
      email: {
        value: '',
        animateUp: false,
        empty: true,
        touched: false,
        message: {
          error: false,
          text: '',
        },
      },
      password: {
        value: '',
        animateUp: false,
        empty: true,
        touched: false,
        message: {
          error: false,
          text: '',
        },
      },
    },
  });
  const [modalMessage, setModalMessasge] = useState('');

  const handleFocus = (event, newestType) => {
    //animation
    setState((prevState) => ({
      ...prevState,
      inputs: {
        ...prevState.inputs,
        [newestType]: {
          ...prevState.inputs[newestType],
          animateUp: true,
          touched: true,
        },
      },
    }));
  };

  const handleBlur = (event, newestType) => {
    //animation & output error if empty
    let targetEmpty =
      state.inputs[newestType].touched &&
      state.inputs[newestType].value.length === 0
        ? true
        : false;

    setState((prevState) => ({
      ...prevState,
      inputs: {
        ...prevState.inputs,
        [newestType]: {
          ...prevState.inputs[newestType],
          //animation
          animateUp: targetEmpty ? false : true,
          //output error if empty
          message: {
            error: targetEmpty
              ? true
              : prevState.inputs[newestType].message.error,
            text: targetEmpty
              ? 'This input is required'
              : prevState.inputs[newestType].message.text,
          },
        },
      },
    }));
  };

  const validateInputs = (
    newestType,
    targetValue,
    targetEmpty,
    submittingForm = false
  ) => {
    //validate input
    let validationSettings = {
      email: newestType === 'email' ? targetValue : state.inputs.email.value,
      password:
        newestType === 'password' ? targetValue : state.inputs.password.value,
      confirmPassword: null,
      isSignup: false,
      emailTouched: state.inputs.email.touched,
      passwordTouched: state.inputs.password.touched,
      confirmPasswordTouched: false,
      submittingForm: submittingForm,
    };
    let anyErrorsObject = returnInputErrors(validationSettings);

    //update state for all inputs
    Object.keys(state.inputs).forEach((inputType) => {
      setState((prevState) => ({
        ...prevState,
        inputs: {
          ...prevState.inputs,
          [inputType]: {
            ...prevState.inputs[inputType],

            //update generic values
            value:
              inputType === newestType
                ? targetValue
                : prevState.inputs[inputType].value,
            empty:
              inputType === newestType
                ? targetEmpty
                : prevState.inputs[inputType].empty,

            //update errors: If no error, set to empty
            message: {
              error: anyErrorsObject[inputType] ? true : false,
              text: anyErrorsObject[inputType]
                ? anyErrorsObject[inputType]
                : false,
            },
          },
        },
      }));
    });
    return anyErrorsObject;
  };

  const handleChange = (event, newestType) => {
    let targetValue = event.target.value;
    let targetEmpty = targetValue.length === 0 ? true : false;
    validateInputs(newestType, targetValue, targetEmpty);
  };

  const submitHandler = (event) => {
    //prevent default form submission
    event.preventDefault();

    //check for any errors before submitting
    let anyErrorsFound = false;
    let errors = validateInputs('', null, null, true);
    Object.keys(errors).forEach((inputType) => {
      if (errors[inputType]) {
        anyErrorsFound = true;
      }
    });

    if (anyErrorsFound) {
      setModalMessasge('Please fix all errors before submitting');
      return;
    } else {
      //assuming the email and password are both valid, log in
      console.log('sending log in form');
      login();
    }
  };

  const login = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(
        state.inputs.email.value,
        state.inputs.password.value
      )
      .catch((error) => {
        switch (error.code) {
          //account diabled
          case 'auth/user-disabled':
            setModalMessasge(
              'This account corresponding to this email has been disabled'
            );
            break;
          case 'auth/invalid-email':
            setModalMessasge('The email or password you entered is incorrect');
            break;
          case 'auth/wrong-password':
            setModalMessasge('The email or password you entered is incorrect');
            break;
          case 'auth/user-not-found':
            setModalMessasge('There is no account associated with this email.');
            break;
          case 'auth/too-many-requests':
            setModalMessasge(
              'Too many unsuccessful attempts. Please try again later.'
            );
            break;
          default:
            console.error(error.code, error.message);
            return setModalMessasge('Server error. Please try again later.');
        }
      });
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
          type='email'
          customType='email'
          handleFocus={(e) => handleFocus(e, 'email')}
          handleBlur={(e) => handleBlur(e, 'email')}
          handleChange={(e) => handleChange(e, 'email')}
          label={'Email*'}
          state={state}
        />
        <Input
          type='password'
          customType='password'
          handleFocus={(e) => handleFocus(e, 'password')}
          handleBlur={(e) => handleBlur(e, 'password')}
          handleChange={(e) => handleChange(e, 'password')}
          label={'Password*'}
          state={state}
        />
        <Modal message={modalMessage} color='black' />
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
