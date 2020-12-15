import React, { useState } from 'react';
import Nav from 'components/Nav/Nav';
import styles from './Profile.module.scss';
import Button from 'components/Button/Button';
import InstrumentArray from 'app/InstrumentArray';
import { db } from 'app/config';
import geoapifyKey from 'app/geoapifyKey';

import { useSelector } from 'react-redux';
import { selectUser } from 'app/userSlice';

import NewInput from 'components/NewInputs/Input';
import Textarea from 'components/Inputs/Textarea';
import Message from 'components/Message/Message';

import { NewInputType } from 'app/types';
import locationFormatter from 'app/locationFormatter';
import suggestionClickHandler from './suggestionClickHandler';
import handleFocus from './handleFocus';
import sendAutoCompleteRequest from './sendAutoCompleteRequest';

import * as ProfileTypes from './ProfileTypes';

export default () => {
	const user = useSelector(selectUser);
	const userLocation = [user.city, user.state, user.country]
		.filter((el) => el)
		.join(', ')
		.trim();

	const [inputs, setInputs] = useState<ProfileTypes.Inputs>({
		activity: {
			label: 'Musical Activity',
			suggestions: {
				selected: false,
				loading: false,
				show: false,
				array: [
					'Arranger',
					'Composer',
					'Conductor',
					'Copyist',
					'Curator',
					'Director',
					'Editor',
					'Engineer',
					'Ensemble',
					'Engraver',
					'Performer',
					'Producer',
					'Publicist',
					'Teacher',
					'Therapist',
					'Worship Leader',
					'Other',
				],
			},
			value: user.activity || '',
			edited: false,
			message: {
				error: false,
				text: 'i.e. Performer, Composer, Teacher, etc.',
				default: 'i.e. Performer, Composer, Teacher, etc.',
			},
		},
		instrument: {
			label: 'Instrument/Voice Type',
			suggestions: {
				selected: false,
				loading: false,
				show: false,
				array: InstrumentArray,
			},
			value: user.instrument || '',
			edited: false,
			message: {
				error: false,
				text: 'i.e. Piano, Violin, Soprano, etc.',
				default: 'i.e. Piano, Violin, Soprano, etc.',
			},
		},
		bio: {
			label: 'Short Bio',
			suggestions: {
				selected: false,
				loading: false,
				show: false,
				array: [],
			},
			value: user.bio || '',
			edited: false,
			message: {
				error: false,
				text: 'Tell us a little about yourself.',
				default: 'Tell us a little about yourself.',
			},
		},
		website: {
			label: 'Website',
			suggestions: {
				selected: false,
				loading: false,
				show: false,
				array: [],
			},
			value: user.website || '',
			edited: false,
			message: {
				error: false,
				text: 'Link to your personal website.',
				default: 'Link to your personal website.',
			},
		},
		location: {
			label: 'Location',
			_data: {
				city: '',
				state: '',
				county: '',
				zip: '',
				country: '',
			},
			suggestionsArray: [],
			value: userLocation,
			edited: false,
			suggestions: {
				selected: false,
				loading: false,
				array: [],
				show: false,
			},
			message: {
				error: false,
				text: 'e.g. Address, City, or State, etc.',
				default: 'e.g. Address, City, or State, etc.',
			},
		},
	});
	const [timerId, setTimerId] = useState(setTimeout(() => {}, 0));
	const [saveMessage, setSaveMessage] = useState('');
	const [locationMessage, setLocationMessage] = useState('');

	const handleBlur = (
		e: React.FormEvent<HTMLInputElement>,
		newestType: ProfileTypes.KeyOfInputs
	) => {
		//hide drop down menu
		if (
			newestType === 'activity' ||
			newestType === 'instrument' ||
			newestType === 'location'
		) {
			setInputs((prevState: ProfileTypes.Inputs) => ({
				...prevState,
				[newestType]: {
					...prevState[newestType],
					//animation
					suggestions: {
						...prevState[newestType].suggestions,
						loading: false,
						show: false,
					},
				},
			}));
		}
	};

	const handleChange = (
		e: React.FormEvent<HTMLInputElement>,
		newestType: ProfileTypes.KeyOfInputs
	) => {
		let targetValue = e.currentTarget.value;

		//validate inputs
		let anyErrorsObject = {
			activity: '',
			instrument: '',
			website: '',
			bio: '',
			location: '',
		};

		//update state for all inputs
		setInputs((prevState: ProfileTypes.Inputs) => ({
			...prevState,
			activity: {
				...prevState.activity,

				//update generic values
				value:
					newestType === 'activity' ? targetValue : prevState.activity.value,
				edited: newestType === 'activity' ? true : prevState.activity.edited,
				//update errors: If no error, set to default message
				message: {
					...prevState.activity.message,
					error: anyErrorsObject.activity ? true : false,
					text: anyErrorsObject.activity
						? anyErrorsObject.activity
						: prevState.activity.message.default,
				},
			},
			instrument: {
				...prevState.instrument,

				//update generic values
				value:
					newestType === 'instrument'
						? targetValue
						: prevState.instrument.value,
				edited:
					newestType === 'instrument' ? true : prevState.instrument.edited,
				//update errors: If no error, set to default message
				message: {
					...prevState.instrument.message,
					error: anyErrorsObject.instrument ? true : false,
					text: anyErrorsObject.instrument
						? anyErrorsObject.instrument
						: prevState.instrument.message.default,
				},
			},
			bio: {
				...prevState.bio,

				//update generic values
				value: newestType === 'bio' ? targetValue : prevState.bio.value,
				edited: newestType === 'bio' ? true : prevState.bio.edited,
				//update errors: If no error, set to default message
				message: {
					...prevState.bio.message,
					error: anyErrorsObject.bio ? true : false,
					text: anyErrorsObject.bio
						? anyErrorsObject.bio
						: prevState.bio.message.default,
				},
			},
			website: {
				...prevState.website,

				//update generic values
				value: newestType === 'website' ? targetValue : prevState.website.value,
				edited: newestType === 'website' ? true : prevState.website.edited,
				//update errors: If no error, set to default message
				message: {
					...prevState.website.message,
					error: anyErrorsObject.website ? true : false,
					text: anyErrorsObject.website
						? anyErrorsObject.website
						: prevState.website.message.default,
				},
			},
			location: {
				...prevState.location,

				//update generic values
				value:
					newestType === 'location' ? targetValue : prevState.location.value,
				edited: newestType === 'location' ? true : prevState.location.edited,
				//update errors: If no error, set to default message
				message: {
					...prevState.location.message,
					error: anyErrorsObject.location ? true : false,
					text: anyErrorsObject.location
						? anyErrorsObject.location
						: prevState.location.message.default,
				},
			},
		}));
		if (newestType === 'location' && targetValue) {
			let requestDelay = 500;
			let cleanedUpRequest = targetValue.trim();
			if (cleanedUpRequest.length === 0) return;
			clearTimeout(timerId);
			setTimerId(
				setTimeout(
					() =>
						sendAutoCompleteRequest(
							setLocationMessage,
							clearLocationSuggestions,
							setInputs,
							targetValue
						),
					requestDelay
				)
			);

			//set autocomplete to loading
			setInputs((prevState: ProfileTypes.Inputs) => ({
				...prevState,
				location: {
					...prevState.location,
					suggestions: {
						...prevState.location.suggestions,
						loading: true,
						array: [],
						show: true,
					},
				},
			}));
		}
	};

	const clearLocationSuggestions = () => {
		setInputs((prevState: ProfileTypes.Inputs) => ({
			...prevState,
			location: {
				...prevState.location,
				suggestions: {
					...prevState.location.suggestions,
					loading: false,
					show: false,
					array: [],
				},
			},
		}));
	};

	const getLocation = () => {
		const options = {
			enableHighAccuracy: true,
			timeout: 30000,
			maximumAge: 0,
		};

		const handleGeolocationSuccess = (pos: ProfileTypes.PositionData) => {
			let key = geoapifyKey;
			let latitude = pos.coords.latitude;
			let longitude = pos.coords.longitude;
			let requestUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&limit=1&apiKey=${key}`;
			var xhr = new XMLHttpRequest();
			xhr.withCredentials = false;
			xhr.open('GET', requestUrl);
			xhr.responseType = 'json';
			xhr.send(null);
			xhr.onerror = () => {
				console.error('Request failed');
				setLocationMessage(`Sorry, we couldn't find your location.`);
			};
			xhr.onload = (data) => {
				if (xhr.status !== 200) {
					// analyze HTTP status of the response
					console.error(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
					setLocationMessage(`Sorry, we couldn't find your location.`);
				} else {
					//if the response succeeds:
					let properties = xhr.response.features[0].properties;
					//reduce info to necessary fields:
					let locationInfoObject = {
						city: properties.city,
						county: properties.county,
						state: properties.state,
						country: properties.country,
						zip: properties.postcode,
					};

					let formattedLocation = [
						locationInfoObject.city,
						locationInfoObject.state,
						locationInfoObject.country,
						locationInfoObject.zip,
					]
						.filter((el) => el)
						.join(', ')
						.trim();

					setInputs((prevState: ProfileTypes.Inputs) => ({
						...prevState,
						location: {
							...prevState.location,
							value: formattedLocation || '',
							suggestions: {
								...prevState.location.suggestions,
								selected: true,
							},
							_data: {
								city: locationInfoObject.city || '',
								county: locationInfoObject.county || '',
								zip: locationInfoObject.zip || '',
								state: locationInfoObject.state || '',
								country: locationInfoObject.country || '',
							},
						},
					}));
				}
			};
		};

		const handleGeolocationFail = (err: { code: any; message: any }) => {
			console.warn(`ERROR(${err.code}): ${err.message}`);
			setLocationMessage(`Sorry, we couldn't find your location.`);
		};

		//if Geolocation is supported, call it (see above)
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				handleGeolocationSuccess,
				handleGeolocationFail,
				options
			);
		} else {
			setLocationMessage('Geolocation is not supported by this browser.');
		}
	};

	const submitHandler = (e: React.SyntheticEvent) => {
		//prevent default form submission
		e.preventDefault();

		//check for errors
		//if inputs edited, but not selected from drop down menu:
		if (inputs.location.edited && !inputs.location.suggestions.selected) {
			setSaveMessage('Please fix all errors before saving.');
			return setInputs((prevState: ProfileTypes.Inputs) => ({
				...prevState,
				location: {
					...prevState.location,
					message: {
						...prevState.location.message,
						error: true,
						text: 'Please select from available options.',
					},
				},
			}));
		}
		if (inputs.activity.edited && !inputs.activity.suggestions.selected) {
			setSaveMessage('Please fix all errors before saving.');
			return setInputs((prevState: ProfileTypes.Inputs) => ({
				...prevState,
				activity: {
					...prevState.activity,
					message: {
						...prevState.activity.message,
						error: true,
						text: 'Please select from available options.',
					},
				},
			}));
		}
		if (inputs.instrument.edited && !inputs.instrument.suggestions.selected) {
			setSaveMessage('Please fix all errors before saving.');
			return setInputs((prevState: ProfileTypes.Inputs) => ({
				...prevState,
				instrument: {
					...prevState.instrument,
					message: {
						...prevState.instrument.message,
						error: true,
						text: 'Please select from available options.',
					},
				},
			}));
		}

		//clear all errors:
		setInputs((prevState: ProfileTypes.Inputs) => {
			for (let key in prevState) {
				prevState[key].message.error = false;
				prevState[key].message.text = prevState[key].message.default;
			}
			return prevState;
		});

		//only update information if new information has been provided
		interface NewInfoFromState {
			activity?: string;
			instrument?: string;
			website?: string;
			bio?: string;
			city?: string;
			county?: string;
			zip?: string;
			state?: string;
			country?: string;
		}
		let newInfoFromState: NewInfoFromState = {};
		if (inputs.activity.edited) {
			newInfoFromState.activity = inputs.activity.value;
		}
		if (inputs.instrument.edited) {
			newInfoFromState.instrument = inputs.instrument.value;
		}
		if (inputs.website.edited) {
			newInfoFromState.website = inputs.website.value;
		}
		if (inputs.bio.edited) {
			newInfoFromState.bio = inputs.bio.value;
		}
		//all state must be updated if location is edited
		//so that more specific information does not persist (such as city)
		//when more general data is changed (such as country)
		if (inputs.location.edited) {
			newInfoFromState = {
				country: inputs.location._data.country || '',
				state: inputs.location._data.state || '',
				zip: inputs.location._data.zip || '',
				county: inputs.location._data.county || '',
				city: inputs.location._data.city || '',
			};
		}

		if (!Object.values(inputs).find((input: NewInputType) => input.edited)) {
			return setSaveMessage('No new settings to update.');
		}

		//update profile information of user
		setSaveMessage('Saving...');
		db.collection('users')
			.doc(user.uid)
			.set(newInfoFromState, { merge: true })
			.then(() => {
				console.log('[Profile]: Document successfully updated in database!');

				//reset "edited" value of inputs so save isn't triggered again if attempted
				setInputs((prevState) => ({
					...prevState,
					activity: {
						...prevState.activity,
						edited: false,
					},
					instrument: {
						...prevState.instrument,
						edited: false,
					},
					bio: {
						...prevState.bio,
						edited: false,
					},
					website: {
						...prevState.website,
						edited: false,
					},
					location: {
						...prevState.location,
						edited: false,
					},
				}));
				setSaveMessage('Your settings have been successfully updated!');
			})
			.catch((error) => {
				console.error(error);
				setSaveMessage('Server error. Please try again later.');
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
					{locationFormatter({
						city: user.city || '',
						state: user.state || '',
						country: user.country || '',
					})}
				</p>
			</div>
			<form onSubmit={submitHandler}>
				<Button onClick={getLocation}>Autofill Location</Button>
				<NewInput
					type='text'
					customType='location'
					handleFocus={(e: React.FormEvent<HTMLInputElement>) =>
						handleFocus(e, 'location', setInputs)
					}
					handleBlur={(e: React.FormEvent<HTMLInputElement>) =>
						handleBlur(e, 'location')
					}
					handleChange={(e: React.FormEvent<HTMLInputElement>) =>
						handleChange(e, 'location')
					}
					input={inputs.location}
					suggestionClickHandler={suggestionClickHandler}
					setInputs={setInputs}
				/>
				<Message
					message={locationMessage}
					color={locationMessage ? 'black' : 'hidden'}
				/>
				<NewInput
					type='text'
					customType='activity'
					handleFocus={(e: React.FormEvent<HTMLInputElement>) =>
						handleFocus(e, 'activity', setInputs)
					}
					handleBlur={(e: React.FormEvent<HTMLInputElement>) =>
						handleBlur(e, 'activity')
					}
					handleChange={(e: React.FormEvent<HTMLInputElement>) =>
						handleChange(e, 'activity')
					}
					input={inputs.activity}
					suggestionClickHandler={suggestionClickHandler}
					setInputs={setInputs}
				/>
				<NewInput
					type='text'
					customType='instrument'
					handleFocus={(e: React.FormEvent<HTMLInputElement>) =>
						handleFocus(e, 'instrument', setInputs)
					}
					handleBlur={(e: React.FormEvent<HTMLInputElement>) =>
						handleBlur(e, 'instrument')
					}
					handleChange={(e: React.FormEvent<HTMLInputElement>) =>
						handleChange(e, 'instrument')
					}
					input={inputs.instrument}
					suggestionClickHandler={suggestionClickHandler}
					setInputs={setInputs}
				/>
				{/* <Textarea
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
					input={inputs.instrument}
				/> */}
				<NewInput
					type='text'
					customType='website'
					handleFocus={(e: React.FormEvent<HTMLInputElement>) =>
						handleFocus(e, 'website', setInputs)
					}
					handleBlur={(e: React.FormEvent<HTMLInputElement>) =>
						handleBlur(e, 'website')
					}
					handleChange={(e: React.FormEvent<HTMLInputElement>) =>
						handleChange(e, 'website')
					}
					input={inputs.website}
					setInputs={setInputs}
				/>
				{saveMessage ? (
					<Message
						message={saveMessage}
						color={saveMessage ? 'black' : 'hidden'}
					/>
				) : null}
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
