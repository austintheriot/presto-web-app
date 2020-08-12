import React, { useState } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/firebase-firestore';
import { db, auth, analytics } from '../../util/config';
import Modal from '../../components/Modal/Modal';
import returnInputErrors from '../../util/returnInputErrors';
import { Redirect, Link } from 'react-router-dom';
import Input from '../../components/Input/Input';
import styles from './Signup.module.scss';
import signInAnonymously from '../../util/signInAnonymously';

import { useSelector } from 'react-redux';
import { selectUser } from '../../util/userSlice';

import home from '../../assets/images/home.svg';
import arrowRight from '../../assets/images/arrow-right.svg';

//redirect with AuthContext once setInputs permeates down to component

export default function Signup(props) {
	const user = useSelector(selectUser);
	let { authenticated } = user;
	const [inputs, setInputs] = useState({
		email: {
			value: '',
			animateUp: false,
			empty: true,
			touched: false,
			message: {
				error: false,
				text: '',
			},
		},
		password: {
			value: '',
			animateUp: false,
			empty: true,
			touched: false,
			message: {
				error: false,
				text: '',
			},
		},
	});
	const [modalMessage, setModalMessage] = useState('');
	const [signedUpUser, setSignedUpUser] = useState(null);
	const [signedInAnonymously, setSignedInAnonymously] = useState(null);

	const handleFocus = (event, newestType) => {
		//animation
		setInputs((prevState) => ({
			...prevState,
			[newestType]: {
				...prevState[newestType],
				animateUp: true,
				touched: true,
			},
		}));
	};

	const handleBlur = (event, newestType) => {
		//animation & output error if empty
		let targetEmpty =
			inputs[newestType].touched && inputs[newestType].value.length === 0
				? true
				: false;

		setInputs((prevState) => ({
			...prevState,
			[newestType]: {
				...prevState[newestType],
				//animation
				animateUp: targetEmpty ? false : true,
				//output error if empty
				message: {
					error: targetEmpty ? true : prevState[newestType].message.error,
					text: targetEmpty
						? 'This field is required'
						: prevState[newestType].message.text,
				},
			},
		}));
	};

	const validateInputs = (
		newestType,
		targetValue,
		targetEmpty,
		submittingForm = false
	) => {
		//validate input
		let validationSettings = {
			email: newestType === 'email' ? targetValue : inputs.email.value,
			password: newestType === 'password' ? targetValue : inputs.password.value,
			confirmPassword: null,
			isSignup: true,
			emailTouched: inputs.email.touched,
			passwordTouched: inputs.password.touched,
			confirmPasswordTouched: false,
			submittingForm: submittingForm,
		};
		let anyErrorsObject = returnInputErrors(validationSettings);

		//update state for all inputs
		Object.keys(inputs).forEach((inputType) => {
			setInputs((prevState) => ({
				...prevState,
				[inputType]: {
					...prevState[inputType],

					//update generic values
					value:
						inputType === newestType ? targetValue : prevState[inputType].value,
					empty:
						inputType === newestType ? targetEmpty : prevState[inputType].empty,

					//update errors: If no error, set to empty
					message: {
						error: anyErrorsObject[inputType] ? true : false,
						text: anyErrorsObject[inputType]
							? anyErrorsObject[inputType]
							: false,
					},
				},
			}));
		});
		return anyErrorsObject;
	};

	const handleChange = (event, newestType) => {
		let targetValue = event.target.value;
		let targetEmpty = targetValue.length === 0 ? true : false;
		validateInputs(newestType, targetValue, targetEmpty);
	};

	const submitHandler = (event) => {
		//prevent default form submission
		event.preventDefault();

		//check for any errors before submitting
		let anyErrorsFound = false;
		let errors = validateInputs('', null, null, true);
		Object.keys(errors).forEach((inputType) => {
			if (errors[inputType]) {
				anyErrorsFound = true;
			}
		});

		if (anyErrorsFound) {
			setModalMessage('Please fix all errors before submitting');
			return;
		} else {
			//assuming the email and password are both valid, signup
			console.log('sending log in form');
			signup();
		}
	};

	const signup = () => {
		auth
			.createUserWithEmailAndPassword(inputs.email.value, inputs.password.value)
			.then((data) => {
				analytics.logEvent('sign_up', {
					method: 'Email & Password',
				});
				setSignedUpUser(data.user);
			})
			.catch((error) => {
				if (error.code === 'auth/email-already-in-use')
					return setModalMessage('Email already in use');
				else if (error.code === 'auth/invalid-email')
					return setModalMessage('Invalid email');
				else if (error.code === 'auth/weak-password')
					return setModalMessage('Password not strong enough');
				else {
					console.error(error.code, error.message);
					setModalMessage('Sorry, there was an error. Please try again later.');
				}
			});
	};

	let redirect = '/signup-personal';
	if (props.history?.location?.state?.redirect) {
		redirect = props.history?.location?.state?.redirect;
		console.log('[Sign Up] will redirect to: ', redirect, ' when finished');
	}

	const redirectAfterAnonymousSignIn = () => {
		if (authenticated && signedInAnonymously) {
			console.log('[Signup] redirecting home...');
			return <Redirect to={'/posts'} />;
		} else {
			return null;
		}
	};

	const redirectAfterSignUp = () => {
		if (authenticated && signedUpUser) {
			console.log(
				'[Sign Up] adding user email & timeCreated to user document:'
			);
			// Add a new document in collection "users"
			db.collection('users')
				.doc(signedUpUser.uid)
				.set(
					{
						email: signedUpUser.email,
						createdAt: firebase.firestore.FieldValue.serverTimestamp(),
						city: 'Austin',
						state: 'Texas',
						country: 'United States',
					},
					{ merge: true }
				)
				.then(() => {
					console.log('Document successfully written!');
				})
				.catch(function (error) {
					console.error('Error writing document: ', error);
				});
			return <Redirect to={redirect} />;
		} else {
			return null;
		}
	};

	const redirectAlreadySignedUp = () => {
		if (authenticated && !signedInAnonymously && !signedUpUser) {
			console.log('[Signup] redirecting without creating document...');
			return (
				<Redirect
					to={{
						pathname: redirect,
						state: {
							infoMessage: 'You are already signed up.',
						},
					}}
				/>
			);
		} else {
			return null;
		}
	};

	//top modal:
	let infoMessage = props.history?.location?.state?.infoMessage;

	return (
		//display modal message if redirected from another page requiring authentication:
		<>
			<div className={styles.LoginDiv}>
				<Link to='/login'>Log In</Link>
				<button
					onClick={() => {
						setSignedInAnonymously(true);
						signInAnonymously(setModalMessage);
					}}>
					I'm a guest
				</button>
			</div>

			{redirectAfterAnonymousSignIn()}
			{redirectAfterSignUp()}
			{redirectAlreadySignedUp()}

			<h1 className={styles.title}>Sign Up</h1>
			{infoMessage ? <Modal message={infoMessage} color='black' /> : null}
			<form onSubmit={submitHandler}>
				<Input
					type='email'
					customType='email'
					handleFocus={(e) => handleFocus(e, 'email')}
					handleBlur={(e) => handleBlur(e, 'email')}
					handleChange={(e) => handleChange(e, 'email')}
					label={'Email*'}
					inputs={inputs}
				/>
				<Input
					type='password'
					customType='password'
					handleFocus={(e) => handleFocus(e, 'password')}
					handleBlur={(e) => handleBlur(e, 'password')}
					handleChange={(e) => handleChange(e, 'password')}
					label={'Password*'}
					inputs={inputs}
				/>
				<Modal message={modalMessage} color='black' />
				<div className={styles.buttonsDiv}>
					<button
						className={styles.linkRight}
						type='submit'
						onClick={submitHandler}>
						<img
							className={styles.linkRightImg}
							src={arrowRight}
							alt='sign up'
						/>
					</button>

					<Link to='/' className={styles.linkLeft}>
						<img className={styles.linkLeftImg} src={home} alt='back' />
					</Link>
				</div>
			</form>
		</>
	);
}
