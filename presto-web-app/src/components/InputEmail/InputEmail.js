import React, { useState } from 'react';
import Input from '../Input/Input';
import returnInputErrors from '../../util/returnInputErrors';

export default function InputEmail(props) {
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
        text: empty ? 'Email is required' : prevState.message.text,
      },
    }));
  };

  const handleChange = (event, type) => {
    let targetValue = event.target.value;
    let empty = targetValue.length === 0 ? true : false;

    //validate email
    let validationSettings = {
      email: targetValue,
      emailTouched: state.touched,
    };

    let anyErrorsOBject = returnInputErrors(validationSettings);
    anyErrorsOBject.email
      ? setState((prevState) => ({
          ...prevState,
          value: targetValue,
          empty,
          message: {
            error: true,
            //keep old message if there was already one
            text: anyErrorsOBject.email || prevState.message.text,
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

    //set state
    setState((prevState) => ({
      ...prevState,
      value: targetValue,
      empty,
    }));
  };

  return (
    <Input
      customType='email'
      handleFocus={handleFocus}
      handleBlur={handleBlur}
      handleChange={(e) => handleChange(e)}
      label={'Email*'}
      state={state}
    />
  );
}
