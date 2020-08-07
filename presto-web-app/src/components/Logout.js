import React from 'react';
import { auth } from '../util/config';
import 'firebase/auth';
import { Link } from 'react-router-dom';

export default () => {
	const logout = () => {
		auth
			.signOut()
			.then(() => {
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
