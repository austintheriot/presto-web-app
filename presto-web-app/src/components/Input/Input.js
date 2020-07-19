import React, { useState } from 'react';
import styles from './Input.module.css';

export default (props) => {
  const [state, setState] = useState({
    innerType: 'password',
  });

  const togglePasswordVisibility = () => {
    setState((prevState) => ({
      innerType: prevState.innerType === 'password' ? 'text' : 'password',
    }));
  };

  return (
    <>
      <div className={styles.div}>
        {props.customType === 'password' ? (
          <img
            className={styles.eye}
            alt='show password'
            src={require('../../assets/images/eye.svg')}
            onClick={togglePasswordVisibility}
          />
        ) : null}
        <label
          className={
            props?.state?.message.error
              ? props?.state?.animateUp
                ? styles.redUp
                : styles.redDown
              : props?.state?.animateUp
              ? styles.up
              : styles.down
          }>
          {props?.label || 'Label'}
        </label>
      </div>
      <input
        list={props.list || ''}
        className={
          props?.state?.message.error
            ? styles.redInput
            : props?.state?.animateUp
            ? styles.colorInput
            : styles.Input
        }
        value={props?.state?.value}
        type={
          props?.type === 'password' ? state.innerType : props?.type || 'text'
        }
        onBlur={props.handleBlur}
        onFocus={props.handleFocus}
        onChange={(e) => props.handleChange(e, props.customType)}
      />
      <p
        className={
          props.state.message.error ? styles.redMessage : styles.message
        }>
        {props.state.message.text}
      </p>
    </>
  );
};
