import { createSlice } from '@reduxjs/toolkit';
import { auth, db } from './config';
import { fetchPosts } from './postsSlice';

import { UserPayload, ReduxState } from './types';

export const userSlice = createSlice({
	name: 'user',
	initialState: {
		user: null,
		status: 'idle',
		error: null, //idle, loading, success, failed
		uid: '',
	},
	reducers: {
		updateUser: (state, action) => {
			state.user = action.payload;
		},
	},
});

//thunk for asynchronously establishing if the user is logged in or not
//& also listening to changes in user authentication
export const initializeApp = () => (dispatch: Function) => {
	new Promise<UserPayload>((resolve, reject) => {
		console.log('[userSlice]: checking user authentication');
		let userData: UserPayload = {
			authenticated: false,
			init: false,
			status: 'idle',
			error: null,
			uid: '',
		};
		dispatch(updateUser(userData));
		auth.onAuthStateChanged((user: any) => {
			if (user) {
				console.log(
					'[userSlice]: authentication data received: user is currently logged in'
				);
				//extract data about user from authentication request
				let { email, uid, displayName, emailVerified, isAnonymous } = user;
				console.log('[userSlice]: fetching user data from database');
				//get user data from database
				db.collection('users')
					.doc(user.uid)
					//subscribe to data changes in real time and push automatically to the rest of the app
					.onSnapshot(
						(doc: any) => {
							console.log('[userSlice]: database data successfully received');
							console.log(
								'[userSlice]: checking to see if received data is empty'
							);
							//update user data on the client side with authentication & database data
							//only show full screen once user info has been successfully retrieved
							//doc will not exist for brand new signups, or if user has not submitted any info
							//if databse data for user DOES exist, initialize data:
							if (doc.exists) {
								console.log(
									'[userSlice]: data is not empty; user document exists in database'
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
									profilePic = '',
								} = doc.data();
								//convert timestamp to string after value has been extracted
								//weird bug here where createdAt is sometimes registerd as null
								if (createdAt) {
									createdAt = createdAt.toDate().toLocaleString();
								}

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
									profilePic,
								};
							} else {
								console.log(
									'[userSlice]: data is empty; user document does not exist in database'
								);
								//if databse data for user does NOT exist, initialize data with auth data only:
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
								};
							}
							console.log(
								'[userSlice]: initializing app with user authentication data and user database data at the same time'
							);
							dispatch(updateUser(userData));
							resolve(userData);
						},
						//if error occurs while trying to fetch user data (logged out, etc.)
						() => {
							let errorMessage =
								'[userSlice.js db catch block]: Error subscribing to changes in user data; unsubscribing from further changes. (User probably logged out)';
							console.log(errorMessage);
							userData = {
								authenticated: false,
								init: true,
								uid: '',
								status: 'failed',
								error: 'Server error. Please try again later.',
							};
							dispatch(updateUser(userData));
							reject(userData);
						}
					);
			} else {
				let errorMessage =
					'[userSlice.js db catch block]: Error subscribing to changes in user data; unsubscribing from further changes. (User probably logged out)';
				console.log(errorMessage);
				//replace all user data with empty object
				//BUT still tell app that everything is initialized
				userData = {
					init: true,
					uid: '',
					authenticated: false,
					status: 'failed',
					error: 'Server error. Please try again later.',
				};
				dispatch(updateUser(userData));
				reject(userData);
			}
		});
	})
		.then((userData) => {
			console.log(
				'[userSlice]: ',
				'Fetching posts fom database based on user data.'
			);
			//search for posts based on the most narrow geographic location first
			let searchKey: 'city' | 'state' | 'country';
			let searchValue: string;
			if (userData?.city) {
				searchKey = 'city';
				searchValue = userData.city;
			} else if (userData?.state) {
				searchKey = 'state';
				searchValue = userData.state;
			} else if (userData?.country) {
				searchKey = 'country';
				searchValue = userData.country;
			} else {
				searchKey = 'country';
				searchValue = 'United States';
			}
			dispatch(fetchPosts(searchKey, searchValue));
		})
		.catch((error) => {
			console.log(error);
		});
};

export const selectUser = (state: ReduxState) => state.user.user;

export const { updateUser } = userSlice.actions;

export default userSlice.reducer;
