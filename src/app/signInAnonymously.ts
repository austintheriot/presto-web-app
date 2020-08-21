import { auth, analytics, db, serverTimeStamp } from './config';

export default (setMessage: Function): void => {
	auth
		.signInAnonymously()
		.then((data) => {
			analytics.logEvent('login', {
				method: 'Anonymous',
			});

			//no need to update user immediately, since local
			//user date will be updated by the authListener in App.js
			//when it detects a change in user authentication

			// Add a new document in collection "users"
			db.collection('users')
				.doc(data!.user!.uid)
				.set(
					{
						name: 'Guest',
						createdAt: serverTimeStamp(),
						city: 'Austin',
						state: 'Texas',
						country: 'United States',
						profilePic: 'https://i.postimg.cc/QdjGdXRk/no-img.png',
					},
					{ merge: true }
				)
				.then(() => {
					console.log('Document successfully written!');
				})
				.catch(function (error) {
					console.error('Error writing document: ', error);
				});
		})
		.catch(function (error) {
			console.error(error.code, error.message);
			setMessage('Server error. Please try again later.');
		});
};
