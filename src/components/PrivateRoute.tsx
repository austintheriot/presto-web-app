import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { selectUser } from 'app/userSlice';

export default ({ component: Component, ...rest }: any) => {
	const user = useSelector(selectUser);

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
