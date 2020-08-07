import React from 'react';
import { auth } from '../util/config';
import { Redirect } from 'react-router-dom';

export default () => {
	auth
		.signOut()
		.then(() => {
			console.log('[LogoutByRender]: User successfully signed out');
		})
		.catch((error) => {
			console.error(error.message);
		});

	return <Redirect to='/' />;
};
