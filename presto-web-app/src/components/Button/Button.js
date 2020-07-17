import React from 'react';
import styles from './Button.module.css';

export default ({ ...props }) => {
  let buttonStyle;

  React.useEffect(() => {
    console.log('[Button.js] useEffect is firing...');
  });

  switch (props.customstyle) {
    case 'inverted':
      buttonStyle = styles.inverted;
      break;
    default:
      buttonStyle = styles.Button;
  }

  return (
    <button className={buttonStyle || styles.Button} {...props}>
      {props.children || 'Button'}
    </button>
  );
};
