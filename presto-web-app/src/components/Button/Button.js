import React from 'react';
import styles from './Button.module.css';

export default ({ ...props }) => {
  return (
    <button className={styles.Button} {...props}>
      {props.children || 'Button'}
    </button>
  );
};
