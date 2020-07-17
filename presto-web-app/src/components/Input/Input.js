import React, { useState } from 'react';
import styles from './Input.module.css';

export default (props) => {
  const [change, setChange] = useState(false);
  const [empty, setEmpty] = useState(true);
  const [inputValue, setInputValue] = useState('');

  const handleFocus = (e) => {
    setChange(true);
    if (props?.handleFocus) {
      props.handleFocus(e, props.validationType || props.type || null);
    }
  };

  const handleBlur = (e) => {
    if (empty) {
      setChange(false);
    } else {
      setChange(true);
    }
    if (props?.handleBlur) {
      props.handleBlur(e, props.validationType || props.type || null);
    }
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);

    let empty = e.target.value.length === 0;
    if (empty) {
      setEmpty(true);
    } else {
      setEmpty(false);
    }

    if (props?.handleChange) {
      props.handleChange(e, props.validationType || props.type || null);
    }
  };

  //set non-default local styles from above by:
  /* 
    <Input styles={
      label: {width: '100%'},
      input: {width: '100%'},
    }/> */

  //or by CSS modules:
  /* 
    <Input classNames={
      label: newClassName,
      input: newClassName,
    }/> */

  return (
    <>
      <div className={styles.div}>
        <label
          className={
            props?.classNames?.label || change ? styles.up : styles.down
          }>
          {props?.label || 'Label'}
        </label>
      </div>
      <input
        className={
          props?.classNames?.input || props.invalid
            ? styles.red
            : change
            ? styles.color
            : styles.gray
        }
        value={inputValue}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        type={props?.type || 'text'}
      />
    </>
  );
};
