import React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { Redirect } from 'react-router-dom';

export default () => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log('[LogoutByRender]: User successfully signed out');
    })
    .catch((error) => {
      console.error(error.message);
    });

  return <Redirect to='/' />;
};
