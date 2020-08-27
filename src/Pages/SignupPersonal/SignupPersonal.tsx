import React, { useState } from 'react';
import { db } from '../../app/config';
import Message from '../../components/Message/Message';
import { Redirect, Link } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import styles from './SignupPersonal.module.scss';
import ProgressBar from '../../components/ProgressBar/ProgressBar';

import { useSelector } from 'react-redux';
import { selectUser } from '../../app/userSlice';

import { HistoryType, InputType } from '../../app/types';

import arrowLeft from '../../assets/images/arrow-left.svg';
import arrowRight from '../../assets/images/arrow-right.svg';
import SpacerMedium from '../../components/Spacers/SpacerMedium';

//redirect with AuthContext once setInputs permeates down to component

interface Inputs {
	name: InputType;
}

type KeyOfInputs = keyof Inputs;

export default function Login(props: HistoryType) {
	window.scrollTo(0, 0);

	const user = useSelector(selectUser);
	const [inputs, setInputs] = useState<Inputs>({
		name: {
			label: 'Full Name',
			value: '',
			animateUp: false,
			empty: true,
			touched: false,
			message: {
				error: false,
				text: 'i.e. First Last',
				default: 'i.e. First Last',
			},
			suggestions: {
				selected: false,
				loading: false,
				show: false,
				array: [],
			},
		},
	});
	const [individualRadioChecked, setIndividualRadioChecked] = useState(true);
	const [ensembleRadioChecked, setEnsembleRadioChecked] = useState(false);
	const [radioValue, setRadioValue] = useState('Individual');
	const [message, setMessage] = useState('');
	const [submitted, setSubmitted] = useState(false);

	const handleButtonOrRadioClicked = (
		e: React.SyntheticEvent,
		type: 'individual' | 'ensemble'
	) => {
		if (type === 'individual') {
			setIndividualRadioChecked(true);
			setEnsembleRadioChecked(false);
			setRadioValue('Individual');
			radioButtonChanged(type);
		} else if (type === 'ensemble') {
			setIndividualRadioChecked(false);
			setEnsembleRadioChecked(true);
			setRadioValue('Ensemble');
			radioButtonChanged(type);
		}
	};

	const radioButtonChanged = (type: 'individual' | 'ensemble') => {
		if (type === 'ensemble') {
			setInputs((prevState) => ({
				name: {
					...prevState.name,
					label: 'Ensemble Name',
					message: {
						...prevState.name.message,
						text: 'i.e. Ninth Bluebird',
						default: 'i.e. Ninth Bluebird',
					},
				},
			}));
		} else if (type === 'individual') {
			setInputs((prevState) => ({
				name: {
					...prevState.name,
					label: 'Full Name',
					message: {
						...prevState.name.message,
						text: 'i.e. First Last',
						default: 'i.e. First Last',
					},
				},
			}));
		}
		setRadioValue(type);
	};

	const handleFocus = (
		e: React.FormEvent<HTMLInputElement>,
		newestType: KeyOfInputs
	) => {
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

	const handleBlur = (
		e: React.FormEvent<HTMLInputElement>,
		newestType: KeyOfInputs
	) => {
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
			},
		}));
	};

	const handleChange = (
		e: React.FormEvent<HTMLInputElement>,
		newestType: KeyOfInputs
	) => {
		let targetValue = e.currentTarget.value;
		let targetEmpty = targetValue.length === 0 ? true : false;

		//validate username
		let errors = {
			name: '',
			username: '',
		};

		let newName = newestType === 'name' ? targetValue : inputs.name.value;
		if (!newName.match(/^[a-z-' ]*$/i)) {
			errors.name = `Only letters, ' or - allowed`;
		}

		//update state for all inputs

		setInputs((prevState) => ({
			...prevState,
			name: {
				...prevState.name,

				//update generic values
				value: 'name' === newestType ? targetValue : prevState.name.value,
				empty: 'name' === newestType ? targetEmpty : prevState.name.empty,
				//update errors: If no error, set to empty
				message: {
					...prevState.name.message,
					error: errors.name ? true : false,
					text: errors.name ? errors.name : prevState.name.message.default,
				},
			},
		}));
	};

	const submitHandler = (e: React.SyntheticEvent) => {
		//prevent default form submission
		e.preventDefault();

		let anyErrors = false;
		if (!inputs.name.value.match(/^[a-z-' ]*$/i)) {
			anyErrors = true;
		}
		if (anyErrors) {
			setMessage('Please fix any errors before submitting');
			return;
		}

		//only update name if one is given

		interface NewInfoFromState {
			type: string;
			name?: string;
		}

		let newInfoFromState: NewInfoFromState = { type: radioValue };
		if (inputs.name.value) newInfoFromState.name = inputs.name.value;

		//update name and username of user
		db.collection('users')
			.doc(user.uid)
			.set(newInfoFromState, { merge: true })
			.then(() => {
				console.log('Document successfully written!');
				//redirect on successful submission
				setSubmitted(true);
			})
			.catch((error) => {
				console.log('[SignupPersonal]: Submit handler catch block:', error);
				setMessage('Server error. Please try again later.');
			});
	};

	//top Message:
	let infoMessage = props.history?.location?.state?.infoMessage;

	return (
		//display Message message if redirected from another page requiring authentication:
		<>
			<div className={styles.SkipDiv}>
				<Link to='/signup-location'>Skip</Link>
			</div>
			{submitted ? <Redirect to={'/signup-location'} /> : null}
			<ProgressBar signup='complete' personal='inProgress' />
			{infoMessage ? <Message message={infoMessage} color='black' /> : null}
			<h1 className={styles.title}>Thanks for Signing up!</h1>
			<p className={styles.subtitle}>
				Add some info about yourself. This information is public and allows
				others to find you easier (you can edit this later).
			</p>
			<form onSubmit={submitHandler}>
				<p className={styles.radioTitle}>I am registering as:</p>
				<div className={styles.radioGroup}>
					<input
						className={styles.radioInput}
						name='type'
						id='individual'
						type='radio'
						readOnly={true}
						checked={individualRadioChecked}
						onClick={(e) => handleButtonOrRadioClicked(e, 'individual')}
					/>
					<label
						className={styles.radioLabel}
						htmlFor='indivdual'
						onClick={(e) => handleButtonOrRadioClicked(e, 'individual')}>
						An individual
					</label>
				</div>
				<div className={styles.radioGroup}>
					<input
						className={styles.radioInput}
						name='type'
						id='ensemble'
						type='radio'
						readOnly={true}
						checked={ensembleRadioChecked}
						onClick={(e) => handleButtonOrRadioClicked(e, 'ensemble')}
					/>
					<label
						className={styles.radioLabel}
						htmlFor='ensemble'
						onClick={(e) => handleButtonOrRadioClicked(e, 'ensemble')}>
						An ensemble
					</label>
				</div>

				<Input
					type='text'
					customType='name'
					handleFocus={(e: React.FormEvent<HTMLInputElement>) =>
						handleFocus(e, 'name')
					}
					handleBlur={(e: React.FormEvent<HTMLInputElement>) =>
						handleBlur(e, 'name')
					}
					handleChange={(e: React.FormEvent<HTMLInputElement>) =>
						handleChange(e, 'name')
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
							alt='continue'
						/>
					</button>

					<Link to='/' className={styles.linkLeft}>
						<img className={styles.linkLeftImg} src={arrowLeft} alt='back' />
					</Link>
				</div>
			</form>
			<SpacerMedium />
		</>
	);
}
