import React, { useState } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { Link, Redirect } from 'react-router-dom';
import Button from '../../components/Button/Button';
import { useAuth } from '../../context/AuthProvider';
import styles from './HomePublic.module.css';
import Logout from '../../components/Logout';
import Modal from '../../components/Modal/Modal';

const Home = (props) => {
  let { authenticated } = useAuth();
  const [modalMessage, setModalMessage] = useState('');
  const [signedInAnonymously, setSignedInAnonymously] = useState(false);

  const signInAnonymously = () => {
    firebase
      .auth()
      .signInAnonymously()
      .then(() => {
        setSignedInAnonymously(true);
      })
      .catch(function (error) {
        console.error(error.code, error.message);
        setModalMessage('Server error. Please try again later.');
      });
  };

  return (
    <>
      {signedInAnonymously ? <Redirect to='/home' /> : null}
      <div className={styles.waveDiv}>
        <svg
          className={styles.waveSvg}
          viewBox='0 0 500 150'
          preserveAspectRatio='none'>
          <path
            className={styles.wavePath}
            d='M-6.53,64.46 C153.95,107.76 271.39,57.56 503.23,153.04 L499.74,-0.00 L0.00,-0.00 Z'></path>
        </svg>
      </div>
      {authenticated ? (
        <div className={styles.LogoutDiv}>
          <Logout />
        </div>
      ) : null}
      <h1 className={styles.title}>Presto</h1>
      <p className={styles.subtitle}>web app for musicians</p>
      <img
        alt=''
        src={require('../../assets/images/home1.svg')}
        className={styles.img1}
      />
      {authenticated ? (
        <Link to='/home' className={styles.Link}>
          <Button>
            <p>Enter</p>
          </Button>
        </Link>
      ) : (
        <>
          <Link to='/login' className={styles.Link}>
            <Button>
              <p>Log In</p>
            </Button>
          </Link>
          <Link to='/signup' className={styles.Link}>
            <Button customstyle='inverted'>
              <p>Sign Up</p>
            </Button>
          </Link>
          <Button customstyle='inverted' onClick={signInAnonymously}>
            <p>I'm a Guest</p>
          </Button>
          <Modal
            message={props.modalMessage ? props.modalMessage : modalMessage}
            color={modalMessage ? 'red' : null}
          />
        </>
      )}
    </>
  );
};

export default Home;
