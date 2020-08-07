import { auth } from '../util/config';

export default () => {
	auth
		.signOut()
		.then(() => {
			console.log('[Logout]: User successfully signed out');
		})
		.catch((error) => {
			console.error(error.message);
		});
};
