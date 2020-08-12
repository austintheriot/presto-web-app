import React, { useState } from 'react';
import Nav from '../../components/Nav/Nav';
import styles from './Profile.module.css';
import Button from '../../components/Button/Button';
import InstrumentArray from '../../util/InstrumentArray';
import { db } from '../../util/config';

import { useSelector } from 'react-redux';
import { selectUser } from '../../util/userSlice';

import Select from '../../components/Select/Select';
import Input from '../../components/Input/Input';
import Textarea from '../../components/Textarea/Textarea';
import Modal from '../../components/Modal/Modal';

export default (props) => {
	const user = useSelector(selectUser);

	const [inputs, setInputs] = useState({
		type: {
			label: 'Individual/Ensemble',
			suggestions: {
				loading: false,
				show: false,
				array: ['Individual', 'Ensemble'],
			},
			value: user.type || '',
			animateUp: user.type,
			empty: !user.type,
			touched: false,
			message: {
				error: false,
				text: '',
				default: '',
			},
		},
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
			value: user.activity || '',
			animateUp: user.activity,
			empty: !user.activity,
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
			value: user.instrument || '',
			animateUp: user.instrument,
			empty: !user.instrument,
			touched: false,
			message: {
				error: false,
				text: 'i.e. Piano, Violin, Soprano, etc.',
				default: 'i.e. Piano, Violin, Soprano, etc.',
			},
		},
		website: {
			label: 'Website',
			value: user.website || '',
			animateUp: user.website,
			empty: !user.website,
			touched: false,
			message: {
				error: false,
				text: 'Link to your personal website.',
				default: 'Link to your personal website.',
			},
		},
		bio: {
			label: 'Short Bio',
			value: user.bio || '',
			animateUp: user.bio,
			empty: !user.bio,
			touched: false,
			message: {
				error: false,
				text: 'Tell us a little about yourself.',
				default: 'Tell us a little about yourself.',
			},
		},
	});
	const [modalMessage, setModalMessage] = useState('');

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
		if (
			newestType === 'type' ||
			newestType === 'activity' ||
			newestType === 'instrument'
		) {
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
		if (
			newestType === 'type' ||
			newestType === 'activity' ||
			newestType === 'instrument'
		) {
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
		if (inputs.type.touched) newInfoFromState.type = inputs.type.value;
		if (inputs.activity.touched)
			newInfoFromState.activity = inputs.activity.value;
		if (inputs.instrument.touched)
			newInfoFromState.instrument = inputs.instrument.value;
		if (inputs.website.touched) newInfoFromState.website = inputs.website.value;
		if (inputs.bio.touched) newInfoFromState.bio = inputs.bio.value;

		if (Object.keys(newInfoFromState).length === 0) {
			return setModalMessage('No new settings to update.');
		}

		//update profile information of user
		setModalMessage('Saving...');
		db.collection('users')
			.doc(user.uid)
			.set(newInfoFromState, { merge: true })
			.then(() => {
				console.log('Document successfully written!');

				//reset "touched" value of inputs so save isn't triggered again if attempted
				Object.keys(inputs).forEach((inputType) => {
					setInputs((prevState) => ({
						...prevState,
						[inputType]: {
							...prevState[inputType],
							touched: false,
						},
					}));
				});
				setModalMessage('Your settings have been successfully updated!');
			})
			.catch((error) => {
				console.error(error);
				setModalMessage('Server error. Please try again later.');
			});
	};

	let dateArray = user.createdAt.split(' ');
	let formattedDate = [dateArray[1], dateArray[2] + ',', dateArray[3]].join(
		' '
	);

	return (
		<>
			<Nav />

			<div className={styles.wrapper}>
				{/* User Name */}
				<h1 className={styles.title}>Profile</h1>

				{/* Location */}
				<p>
					{(user.city || '') + ', '}
					{(user.state || '') + ', '}
					{user.country || ''}
				</p>
			</div>
			<form onSubmit={submitHandler}>
				<Select
					type='text'
					customType='type'
					handleFocus={(e) => handleFocus(e, 'type')}
					handleBlur={(e) => handleBlur(e, 'type')}
					label={'Individual/Ensemble'}
					inputs={inputs}
					suggestionClickHandler={suggestionClickHandler}
				/>
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
				<Modal
					message={modalMessage}
					color={modalMessage ? 'black' : 'hidden'}
				/>
				<Button type='submit' onClick={submitHandler}>
					Save
				</Button>
			</form>
			{/* Date Joined */}
			{user.createdAt ? (
				<p className={styles.joinedAt}>Joined: {formattedDate}</p>
			) : null}
		</>
	);
};
