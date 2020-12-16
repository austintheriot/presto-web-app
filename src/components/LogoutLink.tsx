import React from 'react';
import { auth } from 'app/config';
import { Link } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { updateUser } from 'app/userSlice';

export default () => {
	const dispatch = useDispatch();

	const logout = () => {
		auth
			.signOut()
			.then(() => {
				dispatch(updateUser({ user: null, status: 'failed', error: null }));
				console.log('[Logout]: User successfully signed out');
			})
			.catch((error) => {
				console.error(error.message);
			});
	};

	return (
		<Link to='/' onClick={logout}>
			Log Out
		</Link>
	);
};
