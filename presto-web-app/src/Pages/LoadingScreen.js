import React from 'react';
import styles from './LoadingScreen.module.css'; //local styles

export default () => {
  return (
    <div>
      <img
        src={require('../assets/images/logo--small.svg')}
        alt='logo'
        className={styles.Logo}
      />
      <img
        src={require('../assets/images/loading--small.svg')}
        alt='logo'
        className={styles.LoadingImg1}
      />
      <img
        src={require('../assets/images/loading--small2.svg')}
        alt='logo'
        className={styles.LoadingImg2}
      />
      <p className={styles.LoadingText}>Loading...</p>
    </div>
  );
};
