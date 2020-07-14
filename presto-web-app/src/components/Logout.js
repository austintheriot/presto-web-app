import React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { Link } from 'react-router-dom';

export default () => {
  const signout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log('[Logout]: User successfully signed out');
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  return (
    <Link to='/login' onClick={signout}>
      Log Out
    </Link>
  );
};
