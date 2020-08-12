import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, establishAuthentication } from './util/userSlice';

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

	useEffect(() => {
		dispatch(establishAuthentication());
	}, [dispatch]);

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
