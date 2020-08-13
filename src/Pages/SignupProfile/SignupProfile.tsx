import React, { useState } from 'react';
import { db } from '../../app/config';

import Modal from '../../components/Modal/Modal';
import { Redirect, Link } from 'react-router-dom';
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import Textarea from '../../components/Textarea/Textarea';
import styles from './SignupProfile.module.scss';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import InstrumentArray from '../../app/InstrumentArray';

//redux
import { useSelector } from 'react-redux';
import { selectUser } from '../../app/userSlice';

//types
import { HistoryType, InputType } from '../../app/types';

//images
import arrowLeft from '../../assets/images/arrow-left.svg';
import arrowRight from '../../assets/images/arrow-left.svg';

interface Inputs {
	activity: InputType;
	instrument: InputType;
	website: InputType;
	bio: InputType;
}

type KeyOfInputs = keyof Inputs;

export default function Login(props: HistoryType) {
	const user = useSelector(selectUser);

	const [inputs, setInputs] = useState<Inputs>({
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
			suggestions: {
				loading: false,
				show: false,
				array: [],
			},
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
			suggestions: {
				loading: false,
				show: false,
				array: [],
			},
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

	const suggestionClickHandler = (
		e: React.FormEvent<HTMLInputElement>,
		i: number,
		newestType: KeyOfInputs
	) => {
		let newValue = inputs[newestType].suggestions.array[i];
		setInputs((prevState: Inputs) => ({
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
		if (newestType === 'activity' || newestType === 'instrument') {
			//show drop down menu
			setInputs((prevState: Inputs) => ({
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
			setInputs((prevState: Inputs) => ({
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
		if (newestType === 'activity' || newestType === 'instrument') {
			setInputs((prevState: Inputs) => ({
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
			setInputs((prevState: Inputs) => ({
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

		setInputs((prevState: Inputs) => ({
			...prevState,
			[newestType]: {
				...prevState[newestType],
				//animation
				value: targetValue,
				empty: targetEmpty,
			},
		}));
	};

	const submitHandler = (e: React.SyntheticEvent) => {
		//pre default form submission
		e.preventDefault();

		//check for errors

		//only update information if new information has been provided
		interface NewInfoFromState {
			activity?: string;
			instrument?: string;
			website?: string;
			bio?: string;
		}
		let newInfoFromState: NewInfoFromState = {};
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
					handleFocus={(e: React.FormEvent<HTMLInputElement>) =>
						handleFocus(e, 'activity')
					}
					handleBlur={(e: React.FormEvent<HTMLInputElement>) =>
						handleBlur(e, 'activity')
					}
					label={'Musical Activity'}
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
					label={'Instrument'}
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
					label={'Website'}
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
