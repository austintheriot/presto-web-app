import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button/Button';
import { useAuth } from '../../context/AuthProvider';
import styles from './HomePublic.module.css';
import Logout from '../../components/Logout';

const Home = (props) => {
  let { authenticated } = useAuth();

  return (
    <>
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
        <Link to='/home' style={{ textDecoration: 'none' }}>
          <Button>
            <p>Enter</p>
          </Button>
        </Link>
      ) : (
        <>
          <Link to='/login' style={{ textDecoration: 'none' }}>
            <Button>
              <p>Log In</p>
            </Button>
          </Link>
          <Link to='/signup' style={{ textDecoration: 'none' }}>
            <Button customstyle='inverted'>
              <p>Sign Up</p>
            </Button>
          </Link>
          <Link to='/' style={{ textDecoration: 'none' }}>
            <Button customstyle='inverted'>
              <p>I'm a Guest</p>
            </Button>
          </Link>
        </>
      )}
    </>
  );
};

export default Home;
