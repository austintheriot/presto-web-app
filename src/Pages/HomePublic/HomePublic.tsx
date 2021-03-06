import React, { useState } from 'react';
import { auth, analytics, db, serverTimeStamp } from 'app/config';
import { Link, Redirect } from 'react-router-dom';
import Button from 'components/Button/Button';
import styles from './HomePublic.module.scss';
import Logout from 'components/LogoutLink';
import Message from 'components/Message/Message';

import { useSelector } from 'react-redux';
import { selectUser } from 'app/userSlice';

//images
import home1 from 'assets/images/home1.svg';
import home2 from 'assets/images/home2.svg';
import home3 from 'assets/images/home4.svg';
import home4 from 'assets/images/home5.svg';

const Home = (props: { message: string }) => {
	window.scrollTo(0, 0);

	const user = useSelector(selectUser);
	const [message, setMessage] = useState('');
	const [signedInAnonymously, setSignedInAnonymously] = useState(false);

	const signInAnonymously = () => {
		auth
			.signInAnonymously()
			.then((data) => {
				analytics.logEvent('login', {
					method: 'Anonymous',
				});

				//no need to update user immediately, since local
				//user date will be updated by the authListener in App.js
				//when it detects a change in user authentication

				//redirect to home
				setSignedInAnonymously(true);
				if (data?.user?.uid) {
					//if uid is defined: Add a new document in collection "users"
					db.collection('users')
						.doc(data!.user!.uid)
						.set(
							{
								name: 'Guest',
								createdAt: serverTimeStamp(),
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
				}
			})
			.catch(function (error) {
				console.error(error.code, error.message);
				setMessage('Server error. Please try again later.');
			});
	};

	//Defined here since used twice below
	const LoginButtons = () => {
		return (
			<>
				{user.authenticated ? (
					<Link to='/posts' className={styles.Link}>
						<Button>
							<p>Enter</p>
						</Button>
					</Link>
				) : (
					<>
						<Link to='/login' className={styles.Link}>
							<Button>
								<p>Log In</p>
							</Button>
						</Link>
						<Link to='/signup' className={styles.Link}>
							<Button customstyle='inverted'>
								<p>Sign Up</p>
							</Button>
						</Link>
						<Button customstyle='inverted' onClick={signInAnonymously}>
							<p>I'm a Guest</p>
						</Button>
						<Message
							message={props.message ? props.message : message}
							color={message ? 'red' : ''}
						/>
					</>
				)}
			</>
		);
	};

	return (
		<>
			{signedInAnonymously && user.authenticated ? (
				<Redirect to='/posts' />
			) : null}{' '}
			<div className={styles.waveDiv}>
				<svg
					className={styles.waveSvg}
					viewBox='0 0 500 150'
					preserveAspectRatio='none'>
					<path
						className={styles.wavePath}
						d='M-6.53,64.46 C153.95,107.76 271.39,57.56 503.23,153.04 L499.74,-0.00 L0.00,-0.00 Z'></path>
				</svg>
			</div>
			{user.authenticated ? (
				<div className={styles.LogoutDiv}>
					<Logout />
				</div>
			) : null}
			<h1 className={styles.title}>Presto</h1>
			<p className={styles.subtitle}>web app for musicians</p>
			<img alt='' src={home1} className={styles.home1} />
			<LoginButtons />
			<div className={styles.home2Container}>
				<p className={styles.homeCaption}>
					Meeting and hiring local musicians should be easy.
				</p>
				<img alt='' src={home2} className={styles.home2} />
			</div>
			<div className={styles.home3Container}>
				<p className={styles.homeCaption}>That's why we made Presto.</p>
			</div>
			<p className={styles.homeCaption}>Post a note to find a local:</p>
			<div className={styles.home4Container}>
				<img alt='' src={home3} className={styles.home4} />
				<ul>
					<li>Performer</li>
					<li>Teacher</li>
					<li>Arranger</li>
					<li>Composer</li>
					<li>Conductor</li>
				</ul>
			</div>
			<p className={styles.homeCaption}>
				Once you've found a good match, message them privately to talk more.
			</p>
			<div className={styles.home5Container}>
				<img alt='' src={home4} className={styles.home5} />
			</div>
			<LoginButtons />
		</>
	);
};

export default Home;
