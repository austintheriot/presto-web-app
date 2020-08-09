import React, { useState } from 'react';
import { db } from '../../util/config';

import Modal from '../../components/Modal/Modal';
import { Redirect, Link } from 'react-router-dom';
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import Textarea from '../../components/Textarea/Textarea';
import styles from './SignupProfile.module.css';
import { useAuth } from '../../util/AuthProvider';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import InstrumentArray from '../../util/InstrumentArray';

//redirect with AuthContext once setInputs permeates down to component

import arrowLeft from '../../assets/images/arrow-left.svg';
import arrowRight from '../../assets/images/arrow-left.svg';

export default function Login(props) {
	let { user } = useAuth();

	const [inputs, setInputs] = useState({
		activity: {
			label: 'Musical Activity',
			suggestions: {
				loading: false,
				show: false,
				array: [
					'Performer',
					'Teacher',
					'Composer',
					'Arranger',
					'Conductor',
					'Therapist',
					'Curator',
					'Producer',
					'Publicist',
					'Editor',
					'Copyist',
					'Engraver',
					'Worship Leader',
					'Engineer',
					'Other',
				],
			},
			value: '',
			animateUp: false,
			empty: true,
			touched: false,
			message: {
				error: false,
				text: 'i.e. Performer, Composer, Teacher, etc.',
				default: 'i.e. Performer, Composer, Teacher, etc.',
			},
		},
		instrument: {
			label: 'Instrument/Voice Type',
			suggestions: {
				loading: false,
				show: false,
				array: InstrumentArray,
			},
			value: '',
			animateUp: false,
			empty: true,
			touched: false,
			message: {
				error: false,
				text: 'i.e. Piano, Violin, Soprano, etc.',
				default: 'i.e. Piano, Violin, Soprano, etc.',
			},
		},
		website: {
			label: 'Website',
			value: '',
			animateUp: false,
			empty: true,
			touched: false,
			message: {
				error: false,
				text: 'Link to your personal website.',
				default: 'Link to your personal website.',
			},
		},
		bio: {
			label: 'Short Bio',
			value: '',
			animateUp: false,
			empty: true,
			touched: false,
			message: {
				error: false,
				text: 'Tell us a little about yourself.',
				default: 'Tell us a little about yourself.',
			},
		},
	});
	const [modalMessage, setModalMessage] = useState('');
	const [submitted, setSubmitted] = useState(false);

	const suggestionClickHandler = (e, i, newestType) => {
		let newValue = inputs[newestType].suggestions.array[i];
		setInputs((prevState) => ({
			...prevState,
			[newestType]: {
				...prevState[newestType],
				value: newValue,
			},
		}));
	};

	const handleFocus = (event, newestType) => {
		//animation
		if (newestType === 'activity' || newestType === 'instrument') {
			//show drop down menu
			setInputs((prevState) => ({
				...prevState,
				[newestType]: {
					...prevState[newestType],
					animateUp: true,
					touched: true,
					suggestions: {
						...prevState[newestType].suggestions,
						loading: false,
						show: true,
					},
				},
			}));
		} else {
			setInputs((prevState) => ({
				...prevState,
				[newestType]: {
					...prevState[newestType],
					animateUp: true,
					touched: true,
				},
			}));
		}
	};

	const handleBlur = (e, newestType) => {
		//animation & output error if empty
		let targetEmpty =
			inputs[newestType].touched && inputs[newestType].value.length === 0
				? true
				: false;

		//hide drop down menu
		if (newestType === 'activity' || newestType === 'instrument') {
			setInputs((prevState) => ({
				...prevState,
				[newestType]: {
					...prevState[newestType],
					//animation
					animateUp: targetEmpty ? false : true,
					suggestions: {
						...prevState[newestType].suggestions,
						loading: false,
						show: false,
					},
				},
			}));
		} else {
			setInputs((prevState) => ({
				...prevState,
				[newestType]: {
					...prevState[newestType],
					//animation
					animateUp: targetEmpty ? false : true,
				},
			}));
		}
	};

	const handleChange = (event, newestType) => {
		let targetValue = event.target.value;
		let targetEmpty = targetValue.length === 0 ? true : false;

		//validate inputs

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
					/*  message: {
            ...prevState[inputType].message,
            error: errors[inputType] ? true : false,
            text: errors[inputType]
              ? errors[inputType]
              : prevState[inputType].message.default,
          }, */
				},
			}));
		});
	};

	const submitHandler = (event) => {
		//prevent default form submission
		event.preventDefault();

		//check for errors

		//only update information if new information has been provided
		let newInfoFromState = {};
		if (inputs.activity.value)
			newInfoFromState.activity = inputs.activity.value;
		if (inputs.instrument.value)
			newInfoFromState.instrument = inputs.instrument.value;
		if (inputs.website.value) newInfoFromState.website = inputs.website.value;
		if (inputs.bio.value) newInfoFromState.bio = inputs.bio.value;

		//update profile information of user
		db.collection('users')
			.doc(user.uid)
			.set(newInfoFromState, { merge: true })
			.then(() => {
				console.log('Document successfully written!');
				//redirect on successful submission
				setSubmitted(true);
			})
			.catch((error) => {
				console.error(error);
				setModalMessage('Server error. Please try again later.');
			});
	};

	//top modal:
	let infoMessage = props.history?.location?.state?.infoMessage;

	return (
		//display modal message if redirected from another page requiring authentication:
		<>
			<div className={styles.SkipDiv}>
				<Link to='/posts'>Skip</Link>
			</div>
			{submitted ? <Redirect to={'/posts'} /> : null}
			{infoMessage ? <Modal message={infoMessage} color='black' /> : null}
			<ProgressBar
				signup='complete'
				personal='complete'
				location='complete'
				profile='inProgress'
			/>
			<h1 className={styles.title}>Profile</h1>
			<form onSubmit={submitHandler}>
				<Select
					type='text'
					customType='activity'
					handleFocus={(e) => handleFocus(e, 'activity')}
					handleBlur={(e) => handleBlur(e, 'activity')}
					label={'Musical Activity'}
					inputs={inputs}
					suggestionClickHandler={suggestionClickHandler}
				/>
				<Select
					type='text'
					customType='instrument'
					handleFocus={(e) => handleFocus(e, 'instrument')}
					handleBlur={(e) => handleBlur(e, 'instrument')}
					label={'Instrument'}
					inputs={inputs}
					suggestionClickHandler={suggestionClickHandler}
				/>
				<Input
					type='text'
					customType='website'
					handleFocus={(e) => handleFocus(e, 'website')}
					handleBlur={(e) => handleBlur(e, 'website')}
					handleChange={(e) => handleChange(e, 'website')}
					label={'Website'}
					inputs={inputs}
				/>
				<Textarea
					type='text'
					customType='bio'
					handleFocus={(e) => handleFocus(e, 'bio')}
					handleBlur={(e) => handleBlur(e, 'bio')}
					handleChange={(e) => handleChange(e, 'bio')}
					label={'Short Bio'}
					inputs={inputs}
				/>

				<Modal message={modalMessage} color='black' />
				<div className={styles.buttonsDiv}>
					<Link to='/signup-location' className={styles.linkLeft}>
						<img className={styles.linkLeftImg} src={arrowLeft} alt='back' />
					</Link>

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
				</div>
			</form>
			<div className='spacerMedium'></div>
		</>
	);
}
