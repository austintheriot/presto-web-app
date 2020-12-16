import React, { useState } from 'react';
import cloneDeep from 'lodash/cloneDeep';

import InstrumentArray from 'app/InstrumentArray';
import { db, storage } from 'app/config';
import geoapifyKey from 'app/geoapifyKey';

import { useSelector } from 'react-redux';
import { selectUser } from 'app/userSlice';

import NewInput from 'components/Inputs/Input';
import Textarea from 'components/Inputs/Textarea';
import Message from 'components/Message/Message';
import Nav from 'components/Nav/Nav';
import styles from './Profile.module.scss';
import Button from 'components/Button/Button';
import { LocationDisplay } from 'components/LocationDisplay/LocationDisplay';
import ProfilePicture from 'components/ProfilePicture/ProfilePicture';

import { NewInputType, UserPayload } from 'app/types';
import suggestionClickHandler from './suggestionClickHandler';
import handleFocus from './handleFocus';
import sendAutoCompleteRequest from './sendAutoCompleteRequest';

import * as ProfileTypes from './ProfileTypes';
import formatDate from 'app/formatDate';

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
	const [profilePicMessage, setProfilePicMessage] = useState('');
	const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
	const [profilePicSubmitted, setProfilePicSubmitted] = useState(false);

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

	const anySelectInputErrors = (
		inputs: ProfileTypes.Inputs,
		setSaveMessage: ProfileTypes.SetSaveMessage,
		setInputs: ProfileTypes.SetInputs
	): boolean => {
		if (inputs.location.edited && !inputs.location.suggestions.selected) {
			setSaveMessage('Please fix all errors before saving.');
			setInputs((prevState: ProfileTypes.Inputs) => {
				const newState = cloneDeep(prevState);
				const { location } = newState;
				location.message.error = true;
				location.message.text = 'Please select from available options.';
				return newState;
			});
			return true;
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
			return true;
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
			return true;
		}
		return false;
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
		if (anySelectInputErrors(inputs, setSaveMessage, setInputs)) return;

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

	const anyProfilePicErrors = (file: File | null) => {
		const $5_MB = 5 * 1028 * 1028;
		const ACCEPTED_FILE_TYPES = [
			'image/jpg',
			'image/jpeg',
			'image/png',
			'image/svg+xml',
		];

		if (!file) {
			console.log('[Profile]: No file chosen!');
			setProfilePicMessage('Please select a file.');
			return true;
		}

		if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
			console.log('[Profile]: Wrong file type!');
			setProfilePicMessage(
				'Please choose an image with one the following types: .jpg, .jpeg, .svg, or .png'
			);
			return true;
		}

		if (file.size > $5_MB) {
			console.log('[Profile]: Image size too big!');
			setProfilePicMessage('Image must be less than 5MB.');
			return true;
		}

		return false;
	};

	const chooseProfilePic = (e: React.FormEvent<HTMLInputElement>) => {
		const file = e.currentTarget.files ? e.currentTarget.files[0] : null;
		if (anyProfilePicErrors(file)) {
			setProfilePicFile(null);
			setProfilePicSubmitted(false);
		} else if (file) {
			setProfilePicFile(file);
			setProfilePicMessage(`Selected Image: ${file.name}`);
			setProfilePicSubmitted(false);
		}
	};

	const uploadProfilePic = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (anyProfilePicErrors(profilePicFile)) return;
		try {
			setProfilePicMessage('Loading...');
			const ref = storage.ref().child('profile_pictures').child(user.uid);
			console.log('[Profile]: Uploading new profilePic...');
			await ref.put(profilePicFile!);
			console.log('[Profile]: Uploaded profilePic.');
			console.log('[Profile]: Getting download link for image...');
			const url = await ref.getDownloadURL();
			console.log('[Profile]: Retrieved download link for image.');
			console.log("[Profile]: Updating user's profile info...");
			await db.collection('users').doc(user.uid).set(
				{
					profilePic: url,
				},
				{ merge: true }
			);
			console.log(
				'[Profile]: User profilePic successfully updated in database.'
			);
			setProfilePicMessage('Profile picture updated!');
			setProfilePicFile(null);
			setProfilePicSubmitted(true);
		} catch (err) {
			console.log('[Profile]: Error while uploading profile picture');
			console.log(err);
			setProfilePicMessage('Sorry, an error occurred. Please try again later.');
			setProfilePicSubmitted(false);
		}
	};

	return (
		<>
			<Nav />
			{/* User Name */}
			<h1 className={styles.title}>{user.name ? user.name : 'Profile'}</h1>

			{/* Location */}
			<LocationDisplay user={user} />

			{/* Profile Picture */}
			<ProfilePicture size={'large'} src={user.profilePic} />
			<form onSubmit={uploadProfilePic} className={styles.profilePicForm}>
				<label htmlFor='choose-profile-pic'>Upload Picture</label>
				<input
					onChange={chooseProfilePic}
					id='choose-profile-pic'
					type='file'
					accept='.png, .jpg, .jpeg, .svg'
				/>
				<Button type='submit'>
					{profilePicSubmitted ? 'Submitted' : 'Submit'}
				</Button>
			</form>
			<Message message={profilePicMessage} />

			<hr className={styles.hr} />

			{/* Profile Settings */}
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
					color={locationMessage ? 'black' : ''}
				/>

				{/* Activity */}
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

				{/* Instrument */}
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

				{/* Bio */}
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

				{/* Website */}
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
					<Message message={saveMessage} color={saveMessage ? 'black' : ''} />
				) : null}
				<Button type='submit' onClick={submitHandler}>
					Save
				</Button>
			</form>

			{/* Date Joined */}
			{user.createdAt ? (
				<p className={styles.joinedAt}>Joined: {formatDate(user.createdAt)}</p>
			) : null}
		</>
	);
};
