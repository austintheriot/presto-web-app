import React from 'react';
import styles from './Modal.module.css';

const modal = (props) => {
  let divStyle;
  switch (props?.color) {
    case 'black':
      divStyle = styles.divBlack;
      break;
    case 'red':
      divStyle = styles.divRed;
      break;
    case 'green':
      divStyle = styles.divGreen;
      break;
    default:
      divStyle = styles.divHidden;
  }

  let paragraphStyle;
  switch (props?.color) {
    case 'black':
      paragraphStyle = styles.paragraphBlack;
      break;
    case 'red':
      paragraphStyle = styles.paragraphRed;
      break;
    case 'green':
      paragraphStyle = styles.paragraphGreen;
      break;
    default:
      paragraphStyle = styles.paragraphHidden;
  }

  return (
    <div className={divStyle}>
      <p className={paragraphStyle}>{props.message}</p>
    </div>
  );
};

export default modal;
