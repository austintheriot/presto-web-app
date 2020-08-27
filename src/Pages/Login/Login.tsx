import React, { useState } from 'react';
import { auth, analytics } from '../../app/config';
import Message from '../../components/Message/Message';
import returnInputErrors from '../../app/returnInputErrors';
import { Redirect, Link } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import styles from './Login.module.scss';
import signInAnonymously from '../../app/signInAnonymously';

import { useSelector } from 'react-redux';
import { selectUser } from '../../app/userSlice';

import { HistoryType, InputType } from '../../app/types';

import home from '../../assets/images/home.svg';
import arrowRight from '../../assets/images/arrow-right.svg';

interface Inputs {
	email: InputType;
	password: InputType;
}

type KeyOfInputs = keyof Inputs;

export default function Login(props?: HistoryType) {
	window.scrollTo(0, 0);

	const [inputs, setInputs] = useState<Inputs>({
		email: {
			value: '',
			label: 'Email*',
			animateUp: false,
			empty: true,
			touched: false,
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
			touched: false,
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
				touched: true,
			},
		}));
	};

	const handleBlur = (
		e: React.FormEvent<HTMLInputElement>,
		newestType: KeyOfInputs
	) => {
		//animation & output error if empty
		let targetEmpty =
			inputs[newestType].touched && inputs[newestType].value.length === 0
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
			emailTouched: inputs.email.touched,
			passwordTouched: inputs.password.touched,
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
		//pre default form submission
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
			//assuming the email and password are both valid, log in
			login();
		}
	};

	const login = () => {
		auth
			.signInWithEmailAndPassword(inputs.email.value, inputs.password.value)
			.then(() => {
				analytics.logEvent('login', {
					method: 'Email & Password',
				});
			})
			.catch((error) => {
				switch (error.code) {
					//account diabled
					case 'auth/user-disabled':
						setMessage(
							'This account corresponding to this email has been disabled'
						);
						break;
					case 'auth/invalid-email':
						setMessage('The email or password you entered is incorrect');
						break;
					case 'auth/wrong-password':
						setMessage('The email or password you entered is incorrect');
						break;
					case 'auth/user-not-found':
						setMessage('There is no account associated with this email.');
						break;
					case 'auth/too-many-requests':
						setMessage(
							'Too many unsuccessful attempts. Please try again later.'
						);
						break;
					default:
						console.error(error.code, error.message);
						return setMessage('Server error. Please try again later.');
				}
			});
	};

	const user = useSelector(selectUser);
	let { authenticated } = user;
	let redirect = '/posts';
	if (props?.history?.location?.state?.redirect) {
		redirect = props.history?.location?.state?.redirect;
		console.log('[Login] will redirect to: ', redirect, ' when finished');
	}

	//top Message:
	let infoMessage = props?.history?.location?.state?.infoMessage;

	return (
		//display Message message if redirected from another page requiring authentication:
		<>
			<div className={styles.SignupDiv}>
				<Link to='/signup'>Sign Up</Link>
				<button onClick={() => signInAnonymously(setMessage)}>
					I'm a guest
				</button>
			</div>

			{authenticated ? <Redirect to={redirect} /> : null}

			<h1 className={styles.title}>Log In</h1>
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
					inputs={inputs}
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
					inputs={inputs}
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
							alt='log in'
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
