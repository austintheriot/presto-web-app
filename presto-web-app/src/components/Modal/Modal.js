import React from 'react';
import styles from './Modal.module.css';

const modal = (props) => {
  let divStyle;
  switch (props?.color) {
    case 'red':
      divStyle = styles.divRed;
      break;
    case 'green':
      divStyle = styles.divGreen;
      break;
    default:
      divStyle = styles.div;
  }

  let paragraphStyle;
  switch (props?.color) {
    case 'red':
      paragraphStyle = styles.paragraphRed;
      break;
    case 'green':
      paragraphStyle = styles.paragraphGreen;
      break;
    default:
      paragraphStyle = styles.paragraph;
  }

  return (
    <div className={divStyle}>
      <p className={paragraphStyle}>{props.message}</p>
    </div>
  );
};

export default modal;
