import React, { useState, SyntheticEvent } from 'react';
import Nav from '../../components/Nav/Nav';
import styles from './Profile.module.scss';
import Button from '../../components/Button/Button';
import InstrumentArray from '../../app/InstrumentArray';
import { db } from '../../app/config';

import { useSelector } from 'react-redux';
import { selectUser } from '../../app/userSlice';

import Select from '../../components/Select/Select';
import Input from '../../components/Input/Input';
import Textarea from '../../components/Textarea/Textarea';
import Modal from '../../components/Modal/Modal';

import { InputType } from '../../app/types';

interface Inputs {
	type: InputType;
	activity: InputType;
	instrument: InputType;
	website: InputType;
	bio: InputType;
}

type KeyOfInputs = keyof Inputs;

export default () => {
	const user = useSelector(selectUser);

	const [inputs, setInputs] = useState<Inputs>({
		type: {
			label: 'Individual/Ensemble',
			suggestions: {
				loading: false,
				show: false,
				array: ['Individual', 'Ensemble'],
			},
			value: user.type || '',
			animateUp: !!user.type,
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
			animateUp: !!user.activity,
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
			animateUp: !!user.instrument,
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
			suggestions: {
				loading: false,
				show: false,
				array: [],
			},
			value: user.website || '',
			animateUp: !!user.website,
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
			suggestions: {
				loading: false,
				show: false,
				array: [],
			},
			value: user.bio || '',
			animateUp: !!user.bio,
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

	const suggestionClickHandler = (
		e: React.FormEvent<HTMLInputElement>,
		i: number,
		newestType: KeyOfInputs
	) => {
		let newValue = inputs[newestType].suggestions.array[i];
		setInputs((prevState) => ({
			...prevState,
			[newestType]: {
				...prevState[newestType],
				value: newValue,
			},
		}));
	};

	const handleFocus = (
		e: React.FormEvent<HTMLInputElement>,
		newestType: KeyOfInputs
	) => {
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

	const handleBlur = (
		e: React.FormEvent<HTMLInputElement>,
		newestType: KeyOfInputs
	) => {
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

	const handleChange = (
		e: React.FormEvent<HTMLInputElement>,
		newestType: KeyOfInputs
	) => {
		let targetValue = e.currentTarget.value;
		let targetEmpty = targetValue.length === 0 ? true : false;

		//validate inputs
		let anyErrorsObject = {
			type: '',
			activity: '',
			instrument: '',
			website: '',
			bio: '',
		};

		//update state for all inputs
		setInputs((prevState: Inputs) => ({
			...prevState,
			type: {
				...prevState.type,

				//update generic values
				value: newestType === 'type' ? targetValue : prevState.type.value,
				empty: newestType === 'type' ? targetEmpty : prevState.type.empty,

				//update errors: If no error, set to empty
				message: {
					...prevState.type.message,
					error: anyErrorsObject.type ? true : false,
					text: anyErrorsObject.type ? anyErrorsObject.type : '',
				},
			},

			activity: {
				...prevState.activity,

				//update generic values
				value:
					newestType === 'activity' ? targetValue : prevState.activity.value,
				empty:
					newestType === 'activity' ? targetEmpty : prevState.activity.empty,

				//update errors: If no error, set to empty
				message: {
					...prevState.activity.message,
					error: anyErrorsObject.activity ? true : false,
					text: anyErrorsObject.activity ? anyErrorsObject.activity : '',
				},
			},
			instrument: {
				...prevState.instrument,

				//update generic values
				value:
					newestType === 'instrument'
						? targetValue
						: prevState.instrument.value,
				empty:
					newestType === 'instrument'
						? targetEmpty
						: prevState.instrument.empty,

				//update errors: If no error, set to empty
				message: {
					...prevState.instrument.message,
					error: anyErrorsObject.instrument ? true : false,
					text: anyErrorsObject.instrument ? anyErrorsObject.instrument : '',
				},
			},
			website: {
				...prevState.website,

				//update generic values
				value: newestType === 'website' ? targetValue : prevState.website.value,
				empty: newestType === 'website' ? targetEmpty : prevState.website.empty,

				//update errors: If no error, set to empty
				message: {
					...prevState.website.message,
					error: anyErrorsObject.website ? true : false,
					text: anyErrorsObject.website ? anyErrorsObject.website : '',
				},
			},
			bio: {
				...prevState.bio,

				//update generic values
				value: newestType === 'bio' ? targetValue : prevState.bio.value,
				empty: newestType === 'bio' ? targetEmpty : prevState.bio.empty,

				//update errors: If no error, set to empty
				message: {
					...prevState.bio.message,
					error: anyErrorsObject.bio ? true : false,
					text: anyErrorsObject.bio ? anyErrorsObject.bio : '',
				},
			},
		}));
	};

	const submitHandler = (e: SyntheticEvent) => {
		//prevent default form submission
		e.preventDefault();

		//check for errors

		//only update information if new information has been provided
		interface NewInfoFromState {
			type?: string;
			activity?: string;
			instrument?: string;
			website?: string;
			bio?: string;
		}
		let newInfoFromState: NewInfoFromState = {};
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
				setInputs((prevState) => ({
					type: {
						...prevState.type,
						touched: false,
					},
					activity: {
						...prevState.activity,
						touched: false,
					},
					instrument: {
						...prevState.instrument,
						touched: false,
					},
					website: {
						...prevState.website,
						touched: false,
					},
					bio: {
						...prevState.bio,
						touched: false,
					},
				}));
				setModalMessage('Your settings have been successfully updated!');
			})
			.catch((error) => {
				console.error(error);
				setModalMessage('Server error. Please try again later.');
			});
	};

	let formattedDate = 'Unknown';
	if (user?.createdAt) {
		let dateArray = user.createdAt.split(' ');
		formattedDate = [dateArray[1], dateArray[2] + ',', dateArray[3]].join(' ');
	}

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
					handleFocus={(e: React.FormEvent<HTMLInputElement>) =>
						handleFocus(e, 'type')
					}
					handleBlur={(e: React.FormEvent<HTMLInputElement>) =>
						handleBlur(e, 'type')
					}
					inputs={inputs}
					suggestionClickHandler={suggestionClickHandler}
				/>
				<Select
					type='text'
					customType='activity'
					handleFocus={(e: React.FormEvent<HTMLInputElement>) =>
						handleFocus(e, 'activity')
					}
					handleBlur={(e: React.FormEvent<HTMLInputElement>) =>
						handleBlur(e, 'activity')
					}
					inputs={inputs}
					suggestionClickHandler={suggestionClickHandler}
				/>
				<Select
					type='text'
					customType='instrument'
					handleFocus={(e: React.FormEvent<HTMLInputElement>) =>
						handleFocus(e, 'instrument')
					}
					handleBlur={(e: React.FormEvent<HTMLInputElement>) =>
						handleBlur(e, 'instrument')
					}
					inputs={inputs}
					suggestionClickHandler={suggestionClickHandler}
				/>
				<Input
					type='text'
					customType='website'
					handleFocus={(e: React.FormEvent<HTMLInputElement>) =>
						handleFocus(e, 'website')
					}
					handleBlur={(e: React.FormEvent<HTMLInputElement>) =>
						handleBlur(e, 'website')
					}
					handleChange={(e: React.FormEvent<HTMLInputElement>) =>
						handleChange(e, 'website')
					}
					inputs={inputs}
				/>
				<Textarea
					type='text'
					customType='bio'
					handleFocus={(e: React.FormEvent<HTMLInputElement>) =>
						handleFocus(e, 'bio')
					}
					handleBlur={(e: React.FormEvent<HTMLInputElement>) =>
						handleBlur(e, 'bio')
					}
					handleChange={(e: React.FormEvent<HTMLInputElement>) =>
						handleChange(e, 'bio')
					}
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
