import { auth, db } from '../util/config';

export default (setUser) => {
	let userInfo;
	console.log('[App]: checking user authentication');
	auth.onAuthStateChanged((user) => {
		if (user) {
			console.log('[App]: user logged in');
			//extract data about user from authentication request
			let {
				email,
				uid,
				displayName,
				emailVerified,
				photoUrl,
				isAnonymous,
			} = user;
			console.log('[App]: fetching datbase data');
			//get user data from database
			db.collection('users')
				.doc(user.uid)
				//subscribe to data changes in real time and push automatically to the rest of the app
				.onSnapshot(
					(doc) => {
						console.log('[App]: database data successfully received');
						//update user data on the client side with authentication & database data
						//only show full screen once user info has been successfully retrieved
						//doc will not exist for brand new signups, or if user has not submitted any info
						//if databse data for user DOES exist, initialize data:
						if (doc.exists) {
							console.log('[App]: user document exists in database');
							let {
								activity = '',
								bio = '',
								city = '',
								country = '',
								county = '',
								instrument = '',
								name = '',
								state = '',
								type = '',
								website = '',
								zip = '',
								createdAt = '',
							} = doc.data();

							userInfo = {
								authenticated: true,
								init: true,
								email,
								uid,
								displayName,
								emailVerified,
								photoUrl,
								isAnonymous,
								activity,
								bio,
								city,
								country,
								county,
								instrument,
								name,
								state,
								type,
								website,
								zip,
								createdAt,
							};
						} else {
							console.log('[App]: user document does not exist in database');
							//if databse data for user does NOT exist, initialize data with auth data only:
							userInfo = {
								authenticated: true,
								init: true,
								email,
								uid,
								displayName,
								emailVerified,
								photoUrl,
								isAnonymous,
							};
						}
						console.log('[App]: initializing app and user data');
						console.log(userInfo);
						setUser(userInfo);
					},
					//if error occurs while trying to fetch user data (logged out, etc.)
					() => {
						console.log(
							'[App.js db catch block]: Error subscribing to changes in user data; unsubscribing from further changes.'
						);
						setUser({ init: true, authenticated: false });
					}
				);
		} else {
			//replace all user data with empty object
			//BUT still tell app that everything is initialized
			setUser({ init: true, authenticated: false });
		}
	});
	//second argument here causes to never run again (since the array doesn't change)
};
