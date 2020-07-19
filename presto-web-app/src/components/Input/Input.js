import React from 'react';
import styles from './Input.module.css';

export default (props) => {
  return (
    <>
      <div className={styles.div}>
        <label
          className={
            props?.classNames?.label || props.animateUp
              ? styles.up
              : styles.down
          }>
          {props?.label || 'Label'}
        </label>
      </div>
      <input
        list={props.list || ''}
        className={
          props?.classNames?.input || props.invalid
            ? styles.red
            : props.animateUp
            ? styles.color
            : styles.gray
        }
        value={props.value}
        type={props?.type || 'text'}
        onBlur={props.handleBlur}
        onFocus={props.handleFocus}
        onChange={(e) => props.handleChange(e, props.customType)}
      />
    </>
  );
};
