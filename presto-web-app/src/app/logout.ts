import { auth } from './config';

import { updateUser } from './userSlice';
import store from './store';

export default () => {
	auth
		.signOut()
		.then(() => {
			let payload = { user: null, status: 'failed', error: null };
			store.dispatch(updateUser(payload));
			console.log('[Logout]: User successfully signed out');
		})
		.catch((error) => {
			console.error(error.message);
		});
};
