import React from 'react';
import { auth } from '../util/config';
import { Link } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { updateUser } from '../util/userSlice';

export default () => {
	const dispatch = useDispatch();

	const logout = () => {
		auth
			.signOut()
			.then(() => {
				let payload = { user: null, status: 'failed', error: null };
				dispatch(updateUser(payload));
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
