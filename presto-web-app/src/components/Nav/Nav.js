import React from 'react';
import styles from './Nav.module.css';
import { Link } from 'react-router-dom';

export default (props) => {
  return (
    <>
      <nav className={styles.nav}>
        <ul className={styles.ul}>
          <li className={styles.li}>
            <Link to='/home'>
              <button className={styles.home} data-info='Home'>
                <img src={require('../../assets/images/home.svg')} alt='home' />
              </button>
            </Link>
          </li>
          <li className={styles.li}>
            <Link to='/posts'>
              <button className={styles.button} data-info='Posts'>
                <img
                  src={require('../../assets/images/posts.svg')}
                  alt='posts'
                />
              </button>
            </Link>
          </li>
          <li className={styles.li}>
            <button className={styles.button} data-info='Notifications'>
              <img
                src={require('../../assets/images/notifications.svg')}
                alt='notifications'
              />
            </button>
          </li>
          <li className={styles.li}>
            <Link to='/profile'>
              <button className={styles.button} data-info='Profile'>
                <img
                  src={require('../../assets/images/profile.svg')}
                  alt='profile'
                />
              </button>
            </Link>
          </li>
          <li className={styles.li}>
            <Link to='settings'>
              <button className={styles.button} data-info='Settings'>
                <img
                  src={require('../../assets/images/settings.svg')}
                  alt='settings'
                />
              </button>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};
