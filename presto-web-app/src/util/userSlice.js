import { createSlice } from '@reduxjs/toolkit';
import { auth, db } from './config';

export const userSlice = createSlice({
	name: 'user',
	initialState: {
		user: null,
		status: 'idle',
		error: null, //idle, loading, success, failed
	},
	reducers: {
		updateUser: (state, action) => {
			state.user = action.payload;
		},
	},
});

//thunk for asynchronously establishing if the user is logged in or not
//& also listening to changes in user authentication
export const establishAuthentication = () => (dispatch, getState) => {
	console.log('[App]: checking user authentication');
	let payload = { user: null, status: 'loading', error: null };
	dispatch(updateUser(payload));
	auth.onAuthStateChanged((user) => {
		if (user) {
			console.log(
				'[App]: authentication data received: user is currently logged in'
			);
			//extract data about user from authentication request
			let {
				email,
				uid,
				displayName,
				emailVerified,
				photoUrl,
				isAnonymous,
			} = user;
			console.log('[App]: fetching user data from database');
			//get user data from database
			db.collection('users')
				.doc(user.uid)
				//subscribe to data changes in real time and push automatically to the rest of the app
				.onSnapshot(
					(doc) => {
						console.log('[App]: database data successfully received');
						console.log('[App]: checking to see if received data is empty');
						//update user data on the client side with authentication & database data
						//only show full screen once user info has been successfully retrieved
						//doc will not exist for brand new signups, or if user has not submitted any info
						//if databse data for user DOES exist, initialize data:
						if (doc.exists) {
							console.log(
								'[App]: data is not empty; user document exists in database'
							);
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
							createdAt = createdAt.toDate().toLocaleString();

							payload = {
								authenticated: true,
								init: true,
								status: 'success',
								error: null,
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
							console.log(
								'[App]: data is empty; user document does not exist in database'
							);
							//if databse data for user does NOT exist, initialize data with auth data only:
							payload = {
								authenticated: true,
								status: 'success',
								error: null,
								init: true,
								email,
								uid,
								displayName,
								emailVerified,
								photoUrl,
								isAnonymous,
							};
						}
						console.log(
							'[App]: initializing app with user authentication data and user database data at the same time'
						);
						console.log('[App] user data: ', payload);
						dispatch(updateUser(payload));
					},
					//if error occurs while trying to fetch user data (logged out, etc.)
					() => {
						console.log(
							`[App.js db catch block]: Error subscribing to changes in user data; unsubscribing from further changes. (User probably logged out)`
						);
						let payload = {
							init: true,
							authenticated: false,
							status: 'failed',
							error: 'Server error. Please try again later.',
						};
						dispatch(updateUser(payload));
					}
				);
		} else {
			console.log(
				'[App.js db catch block]: Error subscribing to changes in user data; unsubscribing from further changes. (User probably logged out)'
			);
			//replace all user data with empty object
			//BUT still tell app that everything is initialized
			let payload = {
				init: true,
				authenticated: false,
				status: 'failed',
				error: 'Server error. Please try again later.',
			};
			dispatch(updateUser(payload));
		}
	});
};

export const selectUser = (state) => state.user.user;

export const { updateUser } = userSlice.actions;

export default userSlice.reducer;
