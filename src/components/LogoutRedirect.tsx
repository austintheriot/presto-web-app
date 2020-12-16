import React from 'react';
import { auth } from 'app/config';
import { Redirect } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { updateUser } from 'app/userSlice';

export default () => {
	const dispatch = useDispatch();

	auth
		.signOut()
		.then(() => {
			let payload = { user: null, status: 'failed', error: null };
			dispatch(updateUser(payload));
			console.log('[LogoutByRender]: User successfully signed out');
		})
		.catch((error) => {
			console.error(error.message);
		});

	return <Redirect to='/' />;
};
