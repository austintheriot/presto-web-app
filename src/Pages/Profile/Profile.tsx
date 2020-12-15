import React, { useState } from 'react';
import cloneDeep from 'lodash/cloneDeep';

import Nav from 'components/Nav/Nav';
import styles from './Profile.module.scss';
import Button from 'components/Button/Button';
import InstrumentArray from 'app/InstrumentArray';
import { db } from 'app/config';
import geoapifyKey from 'app/geoapifyKey';

import { useSelector } from 'react-redux';
import { selectUser } from 'app/userSlice';

import NewInput from 'components/Inputs/Input';
import Textarea from 'components/Inputs/Textarea';
import Message from 'components/Message/Message';

import { NewInputType, UserPayload } from 'app/types';
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

	const hideSuggestionList = (
		setInputs: React.Dispatch<React.SetStateAction<ProfileTypes.Inputs>>,
		newestType: string
	) => {
		if (
			newestType === 'activity' ||
			newestType === 'instrument' ||
			newestType === 'location'
		) {
			setInputs((prevState: ProfileTypes.Inputs) => {
				const newState = cloneDeep(prevState);
				const input = newState[newestType];
				input.suggestions.loading = false;
				input.suggestions.show = false;
				return newState;
			});
		}
	};

	const handleBlur = (
		e: React.FormEvent<HTMLInputElement>,
		newestType: string
	) => {
		//hide drop down menu
		hideSuggestionList(setInputs, newestType);
	};

	const setLocationAutocompleteToLoading = (
		setInputs: ProfileTypes.SetInputs
	) => {
		setInputs((prevState: ProfileTypes.Inputs) => {
			const newState = cloneDeep(prevState);
			const { location } = newState;
			location.suggestions.loading = true;
			location.suggestions.array = [];
			location.suggestions.show = true;
			return newState;
		});
	};

	const updateAllInputValuesAndErrors = (
		newestType: string,
		targetValue: string,
		anyErrorsObject: { [key: string]: string },
		setInputs: ProfileTypes.SetInputs
	) => {
		setInputs((prevState: ProfileTypes.Inputs) => {
			const newState = cloneDeep(prevState);
			Object.entries(newState).forEach((inputEntry) => {
				const inputKey = inputEntry[0];
				const inputState: NewInputType = inputEntry[1];
				inputState.value =
					newestType === inputKey ? targetValue : inputState.value;
				inputState.edited = newestType === inputKey ? true : inputState.edited;
				inputState.message.error = anyErrorsObject[inputKey] ? true : false;
				inputState.message.text = anyErrorsObject[inputKey]
					? anyErrorsObject[inputKey]
					: inputState.message.default;
			});
			return newState;
		});
	};

	interface AnyErrorsObject {
		[key: string]: string;
	}

	//TODO: make actual validate function
	const validateInputs = (inputs: any): AnyErrorsObject => {
		return {
			activity: '',
			instrument: '',
			website: '',
			bio: '',
			location: '',
		};
	};

	const restartAutcompleteTimer = (targetValue: string) => {
		const REQUEST_DELAY = 500;
		if (targetValue.trim().length === 0) return;
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
				REQUEST_DELAY
			)
		);
		setLocationAutocompleteToLoading(setInputs);
	};

	const handleChange = (
		e: React.FormEvent<HTMLInputElement>,
		newestType: string
	) => {
		let targetValue = e.currentTarget.value;
		//TODO: validate inputs
		const anyErrorsObject = validateInputs(inputs);
		updateAllInputValuesAndErrors(
			newestType,
			targetValue,
			anyErrorsObject,
			setInputs
		);
		if (newestType === 'location' && targetValue) {
			restartAutcompleteTimer(targetValue);
		}
	};

	const clearLocationSuggestions = () => {
		setInputs((prevState: ProfileTypes.Inputs) => {
			const newState = cloneDeep(prevState);
			newState.location.suggestions.loading = false;
			newState.location.suggestions.show = false;
			newState.location.suggestions.array = [];
			return newState;
		});
	};

	const extractLocationData = (xhr: XMLHttpRequest) => {
		const {
			city,
			county,
			state,
			country,
			zip,
		} = xhr.response.features[0].properties;

		//reduce info to necessary fields:
		const locationDataObject = {
			city,
			county,
			state,
			country,
			zip,
		};

		//stringify location data (to fill location input)
		const locationDataString = [city, state, country, zip]
			.filter((el) => el)
			.join(', ')
			.trim();

		return { locationDataObject, locationDataString };
	};

	const autofillLocationData = (
		setInputs: ProfileTypes.SetInputs,
		locationDataString: string,
		locationDataObject: {
			city: any;
			county: any;
			state: any;
			country: any;
			zip: any;
		}
	) => {
		setInputs((prevState: ProfileTypes.Inputs) => {
			const newState = cloneDeep(prevState);
			const { location } = newState;
			location.value = locationDataString;
			location.suggestions.selected = true;
			location.edited = true;

			//preserve actual location data (un-stringified) for use later:
			location._data = {
				city: locationDataObject.city,
				county: locationDataObject.county,
				zip: locationDataObject.zip,
				state: locationDataObject.state,
				country: locationDataObject.country,
			};

			return newState;
		});
	};

	const autofillLocation = () => {
		const options = {
			enableHighAccuracy: true,
			timeout: 30000,
			maximumAge: 0,
		};

		const autofillSuccess = (pos: ProfileTypes.PositionData) => {
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
				//if response fails
				if (xhr.status !== 200) {
					// analyze HTTP status of the response
					console.error(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
					setLocationMessage(`Sorry, we couldn't find your location.`);
				}

				//if the response succeeds:
				else {
					const {
						locationDataObject,
						locationDataString,
					} = extractLocationData(xhr);

					autofillLocationData(
						setInputs,
						locationDataString,
						locationDataObject
					);
				}
			};
		};

		const autofillError = (err: { code: any; message: any }) => {
			console.warn(`ERROR(${err.code}): ${err.message}`);
			setLocationMessage(`Sorry, we couldn't find your location.`);
		};

		//if Geolocation is supported, call it (see above)
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				autofillSuccess,
				autofillError,
				options
			);
		} else {
			setLocationMessage('Geolocation is not supported by this browser.');
		}
	};

	const createInputObjectFromState = (
		inputs: ProfileTypes.Inputs
	): ProfileTypes.NewInfoFromState => {
		//only update information if new information has been provided

		let newInfoFromState: ProfileTypes.NewInfoFromState = {};
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

		return newInfoFromState;
	};

	const resetInputErrorState = (setInputs: ProfileTypes.SetInputs) => {
		setInputs((prevState: ProfileTypes.Inputs) => {
			const newState = cloneDeep(prevState);
			for (let inputKey in newState) {
				newState[inputKey].message.error = false;
				newState[inputKey].message.text = newState[inputKey].message.default;
			}
			return newState;
		});
	};

	const resetInputEditedState = (setInputs: ProfileTypes.SetInputs) => {
		setInputs((prevState: ProfileTypes.Inputs) => {
			const newState = cloneDeep(prevState);
			for (let inputKey in newState) {
				const input = newState[inputKey];
				input.edited = false;
			}
			return newState;
		});
	};

	const checkForSelectInputErrors = (
		inputs: ProfileTypes.Inputs,
		setSaveMessage: ProfileTypes.SetSaveMessage,
		setInputs: ProfileTypes.SetInputs
	) => {
		if (inputs.location.edited && !inputs.location.suggestions.selected) {
			setSaveMessage('Please fix all errors before saving.');
			setInputs((prevState: ProfileTypes.Inputs) => {
				const newState = cloneDeep(prevState);
				const { location } = newState;
				location.message.error = true;
				location.message.text = 'Please select from available options.';
				return newState;
			});
			return;
		}
		if (inputs.activity.edited && !inputs.activity.suggestions.selected) {
			setSaveMessage('Please fix all errors before saving.');
			setInputs((prevState: ProfileTypes.Inputs) => {
				const newState = cloneDeep(prevState);
				const { activity } = newState;
				activity.message.error = true;
				activity.message.text = 'Please select from available options.';
				return newState;
			});
			return;
		}
		if (inputs.instrument.edited && !inputs.instrument.suggestions.selected) {
			setSaveMessage('Please fix all errors before saving.');
			setInputs((prevState: ProfileTypes.Inputs) => {
				const newState = cloneDeep(prevState);
				const { instrument } = newState;
				instrument.message.error = true;
				instrument.message.text = 'Please select from available options.';
				return newState;
			});
			return;
		}
	};

	function updateProfileData(
		user: UserPayload,
		resetInputEditedState: (setInputs: ProfileTypes.SetInputs) => void,
		setInputs: React.Dispatch<React.SetStateAction<ProfileTypes.Inputs>>,
		setSaveMessage: React.Dispatch<React.SetStateAction<string>>,
		db: firebase.firestore.Firestore,
		newInfoFromState: ProfileTypes.NewInfoFromState
	) {
		db.collection('users')
			.doc(user.uid)
			.set(newInfoFromState, { merge: true })
			.then(() => {
				console.log('[Profile]: Document successfully updated in database!');
				//reset "edited" value of inputs so save isn't triggered again if attempted
				resetInputEditedState(setInputs);
				setSaveMessage('Your settings have been successfully updated!');
			})
			.catch((error) => {
				console.error(error);
				setSaveMessage('Server error. Please try again later.');
			});
	}

	const submitHandler = (e: React.SyntheticEvent) => {
		//prevent default form submission
		e.preventDefault();

		//check for errors
		checkForSelectInputErrors(inputs, setSaveMessage, setInputs);

		//clear all errors:
		resetInputErrorState(setInputs);
		const newInfoFromState = createInputObjectFromState(inputs);

		//Only update values if inputs have been edited
		if (!Object.values(inputs).find((input: NewInputType) => input.edited)) {
			setSaveMessage('No new settings to update.');
			return;
		}

		//Update user profile information in database
		setSaveMessage('Saving...');
		updateProfileData(
			user,
			resetInputEditedState,
			setInputs,
			setSaveMessage,
			db,
			newInfoFromState
		);
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
				<Button onClick={autofillLocation}>Autofill Location</Button>
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
				<Textarea
					customType='bio'
					setInputs={setInputs}
					handleFocus={(e: React.FormEvent<HTMLInputElement>) =>
						handleFocus(e, 'bio', setInputs)
					}
					handleBlur={(e: React.FormEvent<HTMLInputElement>) =>
						handleBlur(e, 'bio')
					}
					handleChange={(e: React.FormEvent<HTMLInputElement>) =>
						handleChange(e, 'bio')
					}
					input={inputs.bio}
				/>
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
