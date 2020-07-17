import React from 'react';
import { useAuth } from '../../context/AuthProvider';
import styles from './HomePrivate.module.css';
import Logout from '../../components/Logout';
import Nav from '../../components/Nav/Nav';

export default (props) => {
  let user = useAuth();

  return (
    <>
      <Nav />
      <div className={styles.waveDiv}>
        <svg
          className={styles.waveSvg}
          viewBox='0 0 500 150'
          preserveAspectRatio='none'>
          <path
            className={styles.wavePath}
            d='M-1.92,94.96 C126.11,160.90 403.16,62.48 506.25,127.44 L499.74,0.00 L0.00,0.00 Z'></path>
        </svg>
      </div>
      <div className={styles.LogoutDiv}>
        <Logout />
      </div>
      {user.firstName || true ? (
        <>
          <p className={styles.welcome}>Welcome,</p>
          <h1 className={styles.title}>{user.firstName || 'Firstname'}</h1>
        </>
      ) : (
        <h1>Welcome</h1>
      )}
    </>
  );
};
