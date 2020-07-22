import React from 'react';
import styles from './ProgressBar.module.css';
import { Link } from 'react-router-dom';

export default function ProgressBar(props) {
  return (
    <div className={styles.line}>
      <Link to='/signup' style={{ textDecoration: 'none' }}>
        <div
          className={[
            styles.circle,
            props.signup === 'complete'
              ? styles.complete
              : props.signup === 'inProgress'
              ? styles.inProgress
              : null,
          ].join(' ')}>
          <p className={styles.p}>Sign Up</p>
        </div>
      </Link>
      <Link to='/signup/personal' style={{ textDecoration: 'none' }}>
        <div
          className={[
            styles.circle,
            props.personal === 'complete'
              ? styles.complete
              : props.personal === 'inProgress'
              ? styles.inProgress
              : null,
          ].join(' ')}>
          <p className={[styles.p]}>Personal</p>
        </div>
      </Link>
      <Link to='/signup/location' style={{ textDecoration: 'none' }}>
        <div
          className={[
            styles.circle,
            props.location === 'complete'
              ? styles.complete
              : props.location === 'inProgress'
              ? styles.inProgress
              : null,
          ].join(' ')}>
          <p className={styles.p}>Location</p>
        </div>
      </Link>
      <Link to='/signup/profile' style={{ textDecoration: 'none' }}>
        <div
          className={[
            styles.circle,
            props.profile === 'complete'
              ? styles.complete
              : props.profile === 'inProgress'
              ? styles.inProgress
              : null,
          ].join(' ')}>
          <p className={[styles.p]}>Profile</p>
        </div>
      </Link>
    </div>
  );
}
