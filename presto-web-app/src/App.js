import React, { useState, useEffect } from 'react';
import { auth, db } from './util/config';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser, selectUser } from './util/userSlice';

//pages
import LoadingScreen from './Pages/LoadingScreen/LoadingScreen';
import HomePublic from './Pages/HomePublic/HomePublic';
import Login from './Pages/Login/Login';
import Signup from './Pages/Signup/Signup';
import SignupPersonal from './Pages/SignupPersonal/SignupPersonal';
import SignupLocation from './Pages/SignupLocation/SignupLocation';
import SignupProfile from './Pages/SignupProfile/SignupProfile';
import LogoutByRender from './components/LogoutByRender';
import Posts from './Pages/Posts/Posts';
import IndividualPost from './Pages/IndividualPost/IndividualPost';
import Profile from './Pages/Profile/Profile';
import Settings from './Pages/Settings/Settings';

//components
import PrivateRoute from './components/PrivateRoute';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	withRouter,
} from 'react-router-dom';

//styling
import './App.css';
import IndividualProfile from './Pages/Individual Profile/IndividualProfile';

function App() {
	const dispatch = useDispatch();
	const user = useSelector(selectUser);

	/* 	const fakeDelay = (delayTime) => {
		return new Promise((resolve, reject) => {
			setTimeout(() => resolve(), delayTime);
		});
	};
	fakeDelay(5000).then(() => {});
 */

	const authListener = () => {
		let payload = { user: null, status: 'loading', error: null };
		console.log('[App]: checking user authentication');
		dispatch(updateUser(payload));
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
								console.log('[App]: user document does not exist in database');
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
							console.log('[App]: initializing app and user data');
							console.log(payload);
							dispatch(updateUser(payload));
						},
						//if error occurs while trying to fetch user data (logged out, etc.)
						() => {
							console.log(
								'[App.js db catch block]: Error subscribing to changes in user data; unsubscribing from further changes.'
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
				//replace all user data with empty object
				//BUT still tell app that everything is initialized
				let payload = { init: true, authenticated: false };
				dispatch(updateUser(payload));
			}
		});
		//second argument here causes to never run again (since the array doesn't change)
	};

	useEffect(() => {
		//authListener initializes authentication & user data, then listens for changes in either
		//set up a listener for changes in user authentication:
		// pass that information through Context API to components that need it
		authListener();
	}, []);

	console.log('user: ', user);

	return (
		<Router>
			<div className='App'>
				{user?.init ? (
					<>
						<Switch>
							<Route exact path='/' component={HomePublic} />
							<Route exact path='/logout' component={LogoutByRender} />
							<Route exact path='/login' component={Login} />
							<Route exact path='/signup' component={Signup} />
							<PrivateRoute
								exact
								path='/signup-personal'
								component={SignupPersonal}
							/>
							<PrivateRoute
								exact
								path='/signup-location'
								component={SignupLocation}
							/>
							<PrivateRoute
								exact
								path='/signup-profile'
								component={SignupProfile}
							/>
							<PrivateRoute exact path='/posts' component={Posts} />
							<PrivateRoute path='/post/*' component={IndividualPost} />
							<PrivateRoute exact path='/profile' component={Profile} />
							<PrivateRoute path='/profile/*' component={IndividualProfile} />
							<PrivateRoute exact path='/settings' component={Settings} />
							<Route path='*' component={HomePublic} />
						</Switch>
					</>
				) : (
					<LoadingScreen />
				)}
			</div>
		</Router>
	);
}

//wrapping the App in a higher order component
//to access redirect props in Login component
//display messages like: please log in to see this page
const AppWithRouter = withRouter(App);

//surrounding app with Router
const AppContainer = () => {
	return (
		<Router>
			<AppWithRouter />
		</Router>
	);
};

export default AppContainer;
