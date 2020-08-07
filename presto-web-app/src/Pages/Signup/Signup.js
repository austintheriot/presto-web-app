import React, { useState } from 'react';
import { db, auth, analytics } from '../../util/config';
import Modal from '../../components/Modal/Modal';
import returnInputErrors from '../../util/returnInputErrors';
import { Redirect, Link } from 'react-router-dom';
import { useAuth } from '../../util/AuthProvider';
import Input from '../../components/Input/Input';
import styles from './Signup.module.css';

import home from '../../assets/images/home.svg';
import arrowRight from '../../assets/images/arrow-right.svg';

//redirect with AuthContext once setInputs permeates down to component

export default function Signup(props) {
	let { authenticated } = useAuth();
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

	const createDocumentAndRedirect = () => {
		if (authenticated && signedUpUser) {
			console.log(
				'[Sign Up] adding user email & timeCreated to user document:'
			);
			// Add a new document in collection "cities"
			db.collection('users')
				.doc(signedUpUser.uid)
				.set(
					{
						email: signedUpUser.email,
						createdAt: new Date().toISOString(),
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

	const redirectWithoutCreatingDocument = () => {
		if (authenticated && !signedUpUser) {
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
			</div>

			{createDocumentAndRedirect()}
			{redirectWithoutCreatingDocument()}

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
					<Link to='/' className={styles.linkLeft}>
						<img className={styles.linkLeftImg} src={home} alt='back' />
					</Link>

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
				</div>
			</form>
		</>
	);
}
