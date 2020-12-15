import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, initializeApp } from 'app/userSlice';

//pages
import LoadingScreen from 'pages/LoadingScreen/LoadingScreen';
import HomePublic from 'pages/HomePublic/HomePublic';
import Login from 'pages/Login/Login';
import Signup from 'pages/Signup/Signup';
import LogoutByRender from 'components/LogoutByRender';
import Posts from 'pages/Posts/Posts';
import IndividualPost from 'pages/IndividualPost/IndividualPost';
import Profile from 'pages/Profile/Profile';
import Settings from 'pages/Settings/Settings';

//components
import PrivateRoute from 'components/PrivateRoute';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	withRouter,
} from 'react-router-dom';

//styling
import 'App.scss';
import IndividualProfile from 'pages/Individual Profile/IndividualProfile';

function App() {
	const dispatch = useDispatch();
	const user = useSelector(selectUser);

	useEffect(() => {
		dispatch(initializeApp());
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
							<PrivateRoute exact path='/posts' component={Posts} />
							<PrivateRoute path='/posts/*' component={IndividualPost} />
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
