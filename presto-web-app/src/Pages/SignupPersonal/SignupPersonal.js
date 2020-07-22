import React, { useState } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import Modal from '../../components/Modal/Modal';
import { Redirect, Link } from 'react-router-dom';
import Input from '../../components/Input/Input';
import styles from './SignupPersonal.module.css';
import { useAuth } from '../../context/AuthProvider';
import SignupPersonal from '../../components/ProgressBar/ProgressBar';

//redirect with AuthContext once setInputs permeates down to component

export default function Login(props) {
  let user = useAuth();
  const [inputs, setInputs] = useState({
    name: {
      label: 'Full Name',
      value: '',
      animateUp: false,
      empty: true,
      touched: false,
      message: {
        error: false,
        text: 'i.e. First Last',
        default: 'i.e. First Last',
      },
    },
  });
  const [individualRadioChecked, setIndividualRadioChecked] = useState(true);
  const [ensembleRadioChecked, setEnsembleRadioChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('individual');
  const [modalMessage, setModalMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleButtonOrRadioClicked = (e, type) => {
    if (type === 'individual') {
      setIndividualRadioChecked(true);
      setEnsembleRadioChecked(false);
    } else if (type === 'ensemble') {
      setIndividualRadioChecked(false);
      setEnsembleRadioChecked(true);
    }
  };

  const radioButtonChanged = (e, type) => {
    if (type === 'ensemble') {
      setInputs((prevState) => ({
        name: {
          ...prevState.name,
          label: 'Ensemble Name',
          message: {
            ...prevState.name.message,
            text: 'i.e. Ninth Bluebird',
            default: 'i.e. Ninth Bluebird',
          },
        },
      }));
    } else if (type === 'individual') {
      setInputs((prevState) => ({
        name: {
          ...prevState.name,
          label: 'Full Name',
          message: {
            ...prevState.name.message,
            text: 'i.e. First Last',
            default: 'i.e. First Last',
          },
        },
      }));
    }
    setRadioValue(type);
  };

  const handleFocus = (event, newestType) => {
    //animation
    setInputs((prevState) => ({
      ...prevState,
      [newestType]: {
        ...prevState[newestType],
        animateUp: true,
        touched: true,
      },
    }));
  };

  const handleBlur = (event, newestType) => {
    //animation & output error if empty
    let targetEmpty =
      inputs[newestType].touched && inputs[newestType].value.length === 0
        ? true
        : false;

    setInputs((prevState) => ({
      ...prevState,
      [newestType]: {
        ...prevState[newestType],
        //animation
        animateUp: targetEmpty ? false : true,
      },
    }));
  };

  const handleChange = (event, newestType) => {
    let targetValue = event.target.value;
    let targetEmpty = targetValue.length === 0 ? true : false;

    //validate username
    let errors = {
      name: '',
      username: '',
    };

    let newName = newestType === 'name' ? targetValue : inputs.name.value;
    if (!newName.match(/^[a-z-' ]*$/i)) {
      errors.name = `Only letters, ' or - allowed`;
    }

    //update state for all inputs
    Object.keys(inputs).forEach((inputType) => {
      setInputs((prevState) => ({
        ...prevState,
        [inputType]: {
          ...prevState[inputType],

          //update generic values
          value:
            inputType === newestType ? targetValue : prevState[inputType].value,
          empty:
            inputType === newestType ? targetEmpty : prevState[inputType].empty,
          //update errors: If no error, set to empty
          message: {
            ...prevState[inputType].message,
            error: errors[inputType] ? true : false,
            text: errors[inputType]
              ? errors[inputType]
              : prevState[inputType].message.default,
          },
        },
      }));
    });
  };

  const submitHandler = (event) => {
    //prevent default form submission
    event.preventDefault();

    let anyErrors = false;
    if (!inputs.name.value.match(/^[a-z-' ]*$/i)) {
      anyErrors = true;
    }
    if (anyErrors) {
      setModalMessage('Please fix any errors before submitting');
      return;
    }

    //update name and username of user
    firebase
      .firestore()
      .collection('users')
      .doc(user.uid)
      .set(
        {
          name: inputs.name.value,
          type: radioValue,
        },
        { merge: true }
      )
      .then(() => {
        console.log('Document successfully written!');
        //redirect on successful submission
        setSubmitted(true);
      })
      .catch((error) => {
        console.error(error);
        setModalMessage('Server error. Please try again later.');
      });
  };

  //top modal:
  let infoMessage = props.history?.location?.state?.infoMessage;

  return (
    //display modal message if redirected from another page requiring authentication:
    <>
      <div className={styles.SkipDiv}>
        <Link to='/signup/location'>Skip</Link>
      </div>
      {submitted ? <Redirect to={'/signup/location'} /> : null}
      <SignupPersonal signup={'complete'} personal={'inProgress'} />
      <h1 className={styles.title}>Thanks for Signing up!</h1>
      <p className={styles.subtitle}>
        Add some info about yourself. This information is public and allows
        others to find you easier (you can edit this later).
      </p>
      {infoMessage ? <Modal message={infoMessage} color='black' /> : null}
      <form onSubmit={submitHandler}>
        <p className={styles.radioTitle}>I am registering as:</p>
        <div className={styles.radioGroup}>
          <input
            className={styles.radioInput}
            name='type'
            id='individual'
            type='radio'
            checked={individualRadioChecked}
            onChange={(e) => radioButtonChanged(e, 'individual')}
            onClick={(e) => handleButtonOrRadioClicked(e, 'individual')}
          />
          <label
            className={styles.radioLabel}
            htmlFor='indivdual'
            onClick={(e) => handleButtonOrRadioClicked(e, 'individual')}>
            An individual
          </label>
        </div>
        <div className={styles.radioGroup}>
          <input
            className={styles.radioInput}
            name='type'
            id='ensemble'
            type='radio'
            checked={ensembleRadioChecked}
            onChange={(e) => radioButtonChanged(e, 'ensemble')}
            onClick={(e) => handleButtonOrRadioClicked(e, 'ensemble')}
          />
          <label
            className={styles.radioLabel}
            htmlFor='ensemble'
            onClick={(e) => handleButtonOrRadioClicked(e, 'ensemble')}>
            An ensemble
          </label>
        </div>

        <Input
          type='text'
          customType='name'
          handleFocus={(e) => handleFocus(e, 'name')}
          handleBlur={(e) => handleBlur(e, 'name')}
          handleChange={(e) => handleChange(e, 'name')}
          label={inputs.name.label}
          inputs={inputs}
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
              alt='continue'
            />
          </button>
        </div>
      </form>
      <div className='spacerMedium'></div>
    </>
  );
}
