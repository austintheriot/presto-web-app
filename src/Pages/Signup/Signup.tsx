import React, { useState } from 'react';
import { db, auth, analytics, serverTimeStamp } from 'app/config';
import Message from 'components/Message/Message';
import returnInputErrors from 'app/returnInputErrors';
import { Redirect, Link } from 'react-router-dom';
import Input from 'components/Inputs/Input';
import styles from './Signup.module.scss';
import signInAnonymously from 'app/signInAnonymously';

import { useSelector } from 'react-redux';
import { selectUser } from 'app/userSlice';

import { HistoryType, InputType, UserAuthenticationInfoType } from 'app/types';

import home from 'assets/images/home.svg';
import arrowRight from 'assets/images/arrow-right.svg';

//redirect with AuthContext once setInputs permeates down to component

interface Inputs {
	email: InputType;
	password: InputType;
}

type KeyOfInputs = keyof Inputs;

export default function Signup(props: HistoryType) {
	window.scrollTo(0, 0);

	const user = useSelector(selectUser);
	let { authenticated } = user;
	const [inputs, setInputs] = useState<Inputs>({
		email: {
			value: '',
			label: 'Email*',
			animateUp: false,
			empty: true,
			edited: false,
			message: {
				error: false,
				text: '',
				default: '',
			},
			suggestions: {
				selected: false,
				loading: false,
				show: false,
				array: [],
			},
		},
		password: {
			value: '',
			label: 'Password*',
			animateUp: false,
			empty: true,
			edited: false,
			message: {
				error: false,
				text: '',
				default: '',
			},
			suggestions: {
				selected: false,
				loading: false,
				show: false,
				array: [],
			},
		},
	});
	const [message, setMessage] = useState('');
	const [signedUpUser, setSignedUpUser] = useState<UserAuthenticationInfoType>(
		null
	);
	const [signedInAnonymously, setSignedInAnonymously] = useState(false);

	const handleFocus = (
		e: React.FormEvent<HTMLInputElement>,
		newestType: KeyOfInputs
	) => {
		//animation
		setInputs((prevState: Inputs) => ({
			...prevState,
			[newestType]: {
				...prevState[newestType],
				animateUp: true,
				edited: true,
			},
		}));
	};

	const handleBlur = (
		e: React.FormEvent<HTMLInputElement>,
		newestType: KeyOfInputs
	) => {
		//animation & output error if empty
		let targetEmpty =
			inputs[newestType].edited && inputs[newestType].value.length === 0
				? true
				: false;

		setInputs((prevState: Inputs) => ({
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
		newestType: KeyOfInputs | string,
		targetValue: string,
		targetEmpty: boolean,
		submittingForm = false
	) => {
		//validate input
		interface Parameters {
			email?: string;
			password?: string;
			confirmPassword?: string;
			isSignup?: boolean;
			emailTouched?: boolean;
			passwordTouched?: boolean;
			confirmPasswordTouched?: boolean;
			submittingForm?: boolean;
		}

		let validationSettings: Parameters = {
			email: newestType === 'email' ? targetValue : inputs.email.value,
			password: newestType === 'password' ? targetValue : inputs.password.value,
			confirmPassword: '',
			isSignup: false,
			emailTouched: inputs.email.edited,
			passwordTouched: inputs.password.edited,
			confirmPasswordTouched: false,
			submittingForm: submittingForm,
		};
		let anyErrorsObject = returnInputErrors(validationSettings);

		//update state for all inputs
		setInputs((prevState: Inputs) => ({
			...prevState,
			email: {
				...prevState.email,

				//update generic values
				value: newestType === 'email' ? targetValue : prevState.email.value,
				empty: newestType === 'email' ? targetEmpty : prevState.email.empty,

				//update errors: If no error, set to empty
				message: {
					...prevState.email.message,
					error: anyErrorsObject.email ? true : false,
					text: anyErrorsObject.email ? anyErrorsObject.email : '',
				},
			},
			password: {
				...prevState.password,

				//update generic values
				value:
					newestType === 'password' ? targetValue : prevState.password.value,
				empty:
					newestType === 'password' ? targetEmpty : prevState.password.empty,

				//update errors: If no error, set to empty
				message: {
					...prevState.password.message,
					error: anyErrorsObject.password ? true : false,
					text: anyErrorsObject.password ? anyErrorsObject.password : '',
				},
			},
		}));
		return anyErrorsObject;
	};

	const handleChange = (
		e: React.FormEvent<HTMLInputElement>,
		newestType: KeyOfInputs
	) => {
		let targetValue = e.currentTarget.value;
		let targetEmpty = targetValue.length === 0 ? true : false;
		validateInputs(newestType, targetValue, targetEmpty);
	};

	const submitHandler = (e: React.SyntheticEvent) => {
		//prevent default form submission
		e.preventDefault();

		//check for any errors before submitting
		let anyErrorsFound = false;
		let errors = validateInputs('', '', false, true);
		if (errors.email || errors.password) {
			anyErrorsFound = true;
		}

		if (anyErrorsFound) {
			setMessage('Please fix all errors before submitting');
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
				setSignedUpUser(data.user);
				analytics.logEvent('sign_up', {
					method: 'Email & Password',
				});
			})
			.catch((error) => {
				if (error.code === 'auth/email-already-in-use')
					return setMessage('Email already in use');
				else if (error.code === 'auth/invalid-email')
					return setMessage('Invalid email');
				else if (error.code === 'auth/weak-password')
					return setMessage('Password not strong enough');
				else {
					console.error(error.code, error.message);
					setMessage('Sorry, there was an error. Please try again later.');
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
		if (authenticated && signedUpUser?.uid) {
			console.log(
				'[Sign Up] adding user email & timeCreated to user document.'
			);
			// Add a new document in collection "users"
			db.collection('users')
				.doc(signedUpUser.uid)
				.set(
					{
						email: signedUpUser.email,
						createdAt: serverTimeStamp(),
						country: 'United States',
						name: 'Guest',
					},
					{ merge: true }
				)
				.then(() => {
					console.log('Document successfully written!');
				})
				.catch((error) => {
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

	//top Message:
	let infoMessage = props.history?.location?.state?.infoMessage;

	return (
		//display Message message if redirected from another page requiring authentication:
		<>
			<div className={styles.LoginDiv}>
				<Link to='/login'>Log In</Link>
				<button
					onClick={() => {
						setSignedInAnonymously(true);
						signInAnonymously(setMessage);
					}}>
					I'm a guest
				</button>
			</div>

			{redirectAfterAnonymousSignIn()}
			{redirectAfterSignUp()}
			{redirectAlreadySignedUp()}

			<h1 className={styles.title}>Sign Up</h1>
			{infoMessage ? <Message message={infoMessage} color='black' /> : null}
			<form onSubmit={submitHandler}>
				<Input
					type='email'
					customType='email'
					handleFocus={(e: React.FormEvent<HTMLInputElement>) =>
						handleFocus(e, 'email')
					}
					handleBlur={(e: React.FormEvent<HTMLInputElement>) =>
						handleBlur(e, 'email')
					}
					handleChange={(e: React.FormEvent<HTMLInputElement>) =>
						handleChange(e, 'email')
					}
					input={inputs.email}
					setInputs={setInputs}
				/>
				<Input
					type='password'
					customType='password'
					handleFocus={(e: React.FormEvent<HTMLInputElement>) =>
						handleFocus(e, 'password')
					}
					handleBlur={(e: React.FormEvent<HTMLInputElement>) =>
						handleBlur(e, 'password')
					}
					handleChange={(e: React.FormEvent<HTMLInputElement>) =>
						handleChange(e, 'password')
					}
					input={inputs.password}
					setInputs={setInputs}
				/>
				<Message message={message} color='black' />
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
