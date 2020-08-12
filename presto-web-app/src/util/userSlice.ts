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

interface ReduxPayload {
	authenticated: boolean;
	init: boolean;
	status: string;
	error?: string | null;
	uid?: string;
	email?: string;
	displayName?: string;
	emailVerified?: false;
	photoUrl?: string;
	isAnonymous?: false;
	activity?: string;
	bio?: string;
	city?: string;
	country?: string;
	county?: string;
	instrument?: string;
	name?: string;
	state?: string;
	type?: string;
	website?: string;
	zip?: string;
	createdAt?: string;
}

//thunk for asynchronously establishing if the user is logged in or not
//& also listening to changes in user authentication
export const establishAuthentication = () => (
	dispatch: Function,
	getState: Function
) => {
	console.log('[App]: checking user authentication');
	let userData: ReduxPayload = {
		authenticated: false,
		init: false,
		status: 'idle',
		error: null,
	};
	dispatch(updateUser(userData));
	auth.onAuthStateChanged((user: any) => {
		if (user) {
			console.log(
				'[App]: authentication data received: user is currently logged in'
			);
			//extract data about user from authentication request
			let { email, uid, displayName, emailVerified, isAnonymous } = user;
			console.log('[App]: fetching user data from database');
			//get user data from database
			db.collection('users')
				.doc(user.uid)
				//subscribe to data changes in real time and push automatically to the rest of the app
				.onSnapshot(
					(doc: any) => {
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
							//convert timestamp to string after value has been extracted
							createdAt = createdAt.toDate().toLocaleString();

							userData = {
								authenticated: true,
								init: true,
								status: 'success',
								error: null,
								email,
								uid,
								displayName,
								emailVerified,
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
							userData = {
								authenticated: true,
								status: 'success',
								error: null,
								init: true,
								email,
								uid,
								displayName,
								emailVerified,
								isAnonymous,
							};
						}
						console.log(
							'[App]: initializing app with user authentication data and user database data at the same time'
						);
						console.log('[App] user data: ', userData);
						dispatch(updateUser(userData));
					},
					//if error occurs while trying to fetch user data (logged out, etc.)
					() => {
						console.log(
							`[App.js db catch block]: Error subscribing to changes in user data; unsubscribing from further changes. (User probably logged out)`
						);
						let userData = {
							init: true,
							authenticated: false,
							status: 'failed',
							error: 'Server error. Please try again later.',
						};
						dispatch(updateUser(userData));
					}
				);
		} else {
			console.log(
				'[App.js db catch block]: Error subscribing to changes in user data; unsubscribing from further changes. (User probably logged out)'
			);
			//replace all user data with empty object
			//BUT still tell app that everything is initialized
			let userData = {
				init: true,
				authenticated: false,
				status: 'failed',
				error: 'Server error. Please try again later.',
			};
			dispatch(updateUser(userData));
		}
	});
};

interface UserSlice {
	user: {
		user: ReduxPayload;
	};
}

export const selectUser = (state: UserSlice) => state.user.user;

export const { updateUser } = userSlice.actions;

export default userSlice.reducer;
