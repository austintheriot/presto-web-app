import React, { useState } from 'react';
import Input from '../Input/Input';
import returnInputErrors from '../../util/returnInputErrors';

//assume that the password is not a signup form
export default function InputPassword({ isSignup = true }) {
  const [state, setState] = useState({
    value: '',
    animateUp: false,
    empty: true,
    touched: false,
    message: {
      error: false,
      text: '',
    },
  });

  const handleFocus = () => {
    //animation
    setState((prevState) => ({ ...prevState, animateUp: true, touched: true }));
  };

  const handleBlur = () => {
    //animation

    let empty = state.touched && state.value.length === 0 ? true : false;

    setState((prevState) => ({
      ...prevState,
      animateUp: prevState.empty ? false : true,
      message: {
        error: empty ? true : prevState.message.error,
        text: empty ? 'Password is required' : prevState.message.text,
      },
    }));
  };

  const handleChange = (e) => {
    let targetValue = e.target.value;
    let empty = targetValue.length === 0 ? true : false;

    //validate password
    let validationSettings = {
      password: targetValue,
      passwordTouched: state.touched,
      isSignup,
    };

    let anyErrorsOBject = returnInputErrors(validationSettings);
    anyErrorsOBject.password
      ? setState((prevState) => ({
          ...prevState,
          value: targetValue,
          empty,
          message: {
            error: true,
            //keep old message if there was already one
            text: anyErrorsOBject.password || prevState.message.text,
          },
        }))
      : setState((prevState) => ({
          ...prevState,
          value: targetValue,
          empty,
          message: {
            error: false,
            //keep old message if there was already one
            text: '',
          },
        }));
  };

  return (
    <Input
      type='password'
      customType='password'
      handleFocus={handleFocus}
      handleBlur={handleBlur}
      handleChange={(e) => handleChange(e)}
      label={'Password*'}
      state={state}
    />
  );
}
