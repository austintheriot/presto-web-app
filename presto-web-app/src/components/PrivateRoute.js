import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../util/AuthProvider';

export default ({ component: Component, ...rest }) => {
	const [user] = useAuth();
	return (
		// Show the component only when the user is logged in
		// Otherwise, redirect the user to /login page
		<Route
			{...rest}
			render={(props) =>
				user.authenticated ? (
					<Component {...props} />
				) : (
					<Redirect
						to={{
							pathname: '/login',
							state: {
								infoMessage: 'You must be logged in to see this page.',
							},
						}}
					/>
				)
			}
		/>
	);
};
