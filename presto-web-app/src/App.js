import React, { useState, useEffect } from 'react';
import { firebaseAuth } from './util/config';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

//pages
import LoadingScreen from './Pages/LoadingScreen/LoadingScreen';
import HomePublic from './Pages/HomePublic/HomePublic';
import HomePrivate from './Pages/HomePrivate/HomePrivate';
import Login from './Pages/Login/Login';
import Signup from './Pages/Signup/Signup';
import SignupPersonal from './Pages/SignupPersonal/SignupPersonal';
import SignupLocation from './Pages/SignupLocation/SignupLocation';
import SignupProfile from './Pages/SignupProfile/SignupProfile';
import LogoutByRender from './components/LogoutByRender';
import Posts from './Pages/Posts/Posts';
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

//context
import { AuthContext } from './context/AuthProvider';

//styling
import './App.css';

//Other SDKs:
/* import "firebase/analytics";
import "firebase/functions";
import "firebase/messaging";
import "firebase/storage";
import "firebase/performance";
import "firebase/database";
import "firebase/remote-config"; */

/* const db = firebase.firestore(); */

function App() {
	const [user, setUser] = useState(false);

	/* 	const fakeDelay = (delayTime) => {
		return new Promise((resolve, reject) => {
			setTimeout(() => resolve(), delayTime);
		});
  }; */
	/* fakeDelay(5000).then(() => {}) */

	useEffect(() => {
		authListener();
		console.log('[App.js] useEffect is firing...');
	}, []);

	function authListener() {
		firebaseAuth.onAuthStateChanged((user) => {
			if (user) {
				//get data about user from authentication request
				let {
					email,
					uid,
					displayName,
					emailVerified,
					photoUrl,
					isAnonymous,
				} = user;
				console.log('[App]: user logged in');
				//get user data from database
				firebase
					.firestore()
					.collection('users')
					.doc(user.uid)
					.get()
					.then((doc) => {
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
						} = doc.data();

						let allUserInfo = {
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
						};

						//update user data on the client side with authentication & database data
						//only show full screen once user info has been successfully retrieved
						setUser(allUserInfo);
					})
					.catch((err) => {
						console.error(err);
					});
			} else {
				//replace all user data with empty object
				//BUT still tell app that everything is initialized
				setUser({ init: true });
			}
		});
		//second argument here causes to never run again (since the array doesn't change)
	}
	return (
		<AuthContext.Provider value={user}>
			<Router>
				<div className='App'>
					{user.init ? (
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
								<PrivateRoute exact path='/home' component={HomePrivate} />
								<PrivateRoute exact path='/posts' component={Posts} />
								<PrivateRoute exact path='/profile' component={Profile} />
								<PrivateRoute exact path='/settings' component={Settings} />
								<Route path='*' component={HomePublic} />
							</Switch>
						</>
					) : (
						<LoadingScreen />
					)}
				</div>
			</Router>
		</AuthContext.Provider>
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
