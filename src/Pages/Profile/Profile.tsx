import React, { useState } from 'react';
import Nav from '../../components/Nav/Nav';
import styles from './Profile.module.scss';
import Button from '../../components/Button/Button';
import InstrumentArray from '../../app/InstrumentArray';
import { db } from '../../app/config';
import geoapifyKey from '../../app/geoapifyKey';

import { useSelector } from 'react-redux';
import { selectUser } from '../../app/userSlice';

import Input from '../../components/Inputs/Input';
import Textarea from '../../components/Inputs/Textarea';
import Message from '../../components/Message/Message';

import { InputType } from '../../app/types';
import locationFormatter from '../../app/locationFormatter';

interface GeoapifyData {
	properties: {
		city?: string;
		state?: string;
		county?: string;
		postcode?: string;
		country?: string;
	};
}

interface LocationData {
	city?: string;
	state?: string;
	county?: string;
	zip?: string;
	country?: string;
}

interface PositionData {
	coords: {
		latitude: number;
		longitude: number;
	};
}
type CollectedDataArray = LocationData[];

interface LocationType extends InputType {
	_data: {
		city: string;
		state: string;
		county: string;
		zip: string;
		country: string;
	};
	suggestionsArray: any[];
}

interface Inputs {
	activity: InputType;
	instrument: InputType;
	website: InputType;
	bio: InputType;
	location: LocationType;
}

type KeyOfInputs = keyof Inputs;

export default () => {
	const user = useSelector(selectUser);
	const userLocation = [user.city, user.state, user.country]
		.filter((el) => el)
		.join(', ')
		.trim();

	const [inputs, setInputs] = useState<Inputs>({
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
				selected: false,
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
		bio: {
			label: 'Short Bio',
			suggestions: {
				selected: false,
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
		website: {
			label: 'Website',
			suggestions: {
				selected: false,
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
			animateUp: !!userLocation,
			empty: !userLocation,
			touched: false,
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

	const suggestionClickHandler = (
		e: React.FormEvent<HTMLInputElement>,
		i: number,
		newestType: KeyOfInputs
	) => {
		let newValue = inputs[newestType].suggestions.array[i];

		if (newestType === 'location') {
			const formattedData = newValue;
			const unformattedData = inputs.location.suggestionsArray[i];
			setInputs((prevState: Inputs) => ({
				...prevState,
				location: {
					...prevState.location,
					value: formattedData || '',
					empty: !formattedData,
					animateUp: !!formattedData,
					suggestions: {
						...prevState.location.suggestions,
						selected: true,
					},
					_data: {
						city: unformattedData.city || '',
						county: unformattedData.county || '',
						zip: unformattedData.zip || '',
						state: unformattedData.state || '',
						country: unformattedData.country || '',
					},
				},
			}));
		} else {
			setInputs((prevState) => ({
				...prevState,
				[newestType]: {
					...prevState[newestType],
					value: newValue,
					// empty: !newValue,
					// animateUp: !!newValue,
				},
			}));
		}
	};

	const handleFocus = (
		e: React.FormEvent<HTMLInputElement>,
		newestType: KeyOfInputs
	) => {
		//animation
		if (
			newestType === 'activity' ||
			newestType === 'instrument' ||
			newestType === 'location'
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
			newestType === 'activity' ||
			newestType === 'instrument' ||
			newestType === 'location'
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
			activity: '',
			instrument: '',
			website: '',
			bio: '',
			location: '',
		};

		//update state for all inputs
		setInputs((prevState: Inputs) => ({
			...prevState,
			activity: {
				...prevState.activity,

				//update generic values
				value:
					newestType === 'activity' ? targetValue : prevState.activity.value,
				empty:
					newestType === 'activity' ? targetEmpty : prevState.activity.empty,

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
				empty:
					newestType === 'instrument'
						? targetEmpty
						: prevState.instrument.empty,

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
				empty: newestType === 'bio' ? targetEmpty : prevState.bio.empty,

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
				empty: newestType === 'website' ? targetEmpty : prevState.website.empty,

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
				empty:
					newestType === 'location' ? targetEmpty : prevState.location.empty,

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
				setTimeout(() => sendAutoCompleteRequest(targetValue), requestDelay)
			);

			//set autocomplete to loading
			setInputs((prevState: Inputs) => ({
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
		setInputs((prevState) => ({
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

	const sendAutoCompleteRequest = (locationInputValue: string) => {
		let key = geoapifyKey;
		let requestUrl = `https://api.geoapify.com/v1/geocode/autocomplete?text=${locationInputValue}&limit=5&apiKey=${key}`;
		var xhr = new XMLHttpRequest();
		xhr.withCredentials = false;
		xhr.open('GET', requestUrl);
		xhr.responseType = 'json';
		xhr.send(null);
		xhr.onerror = () => {
			console.error('Request failed');
			setLocationMessage(`Sorry, we couldn't find your location.`);
			clearLocationSuggestions();
		};
		xhr.onload = () => {
			if (xhr.status !== 200) {
				// analyze HTTP status of the response
				console.error(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
				clearLocationSuggestions();
			} else {
				//if the response succeeds:
				let geoapifyDataArray = xhr.response.features;
				if (geoapifyDataArray.length === 0) {
					setLocationMessage(
						`Sorry, we couldn't find any locations that matched.`
					);
					clearLocationSuggestions();
				} else {
					setLocationMessage(``);
				}

				//turn data into an array of objects for later recall
				let collectedDataArray: CollectedDataArray = geoapifyDataArray.map(
					({ properties }: GeoapifyData) => {
						return {
							city: properties.city || null,
							state: properties.state || null,
							county: properties.county || null,
							zip: properties.postcode || null,
							country: properties.country || null,
						};
					}
				);

				//format data to be usable for the suggestions drop down menu
				let collectedDataArrayFormatted = collectedDataArray.map((el) => {
					return [el.city, el.state, el.country, el.zip]
						.filter((el) => el)
						.join(', ')
						.trim();
				});

				//update autocomplete suggestions for location input
				setInputs((prevState) => ({
					...prevState,
					location: {
						...prevState.location,
						suggestionsArray: collectedDataArray, //unformatted data (for sending)
						suggestions: {
							//data formatted as a string for SuggestionsList
							...prevState.location.suggestions,
							loading: false,
							show: true,
							array: collectedDataArrayFormatted,
						},
					},
				}));
			}
		};
	};

	const getLocation = () => {
		const options = {
			enableHighAccuracy: true,
			timeout: 30000,
			maximumAge: 0,
		};

		const handleGeolocationSuccess = (pos: PositionData) => {
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

					setInputs((prevState: Inputs) => ({
						...prevState,
						location: {
							...prevState.location,
							value: formattedLocation || '',
							empty: !formattedLocation,
							animateUp: !!formattedLocation,
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
		if (inputs.activity.touched)
			newInfoFromState.activity = inputs.activity.value;
		if (inputs.instrument.touched)
			newInfoFromState.instrument = inputs.instrument.value;
		if (inputs.website.touched) newInfoFromState.website = inputs.website.value;
		if (inputs.bio.touched) newInfoFromState.bio = inputs.bio.value;
		if (inputs.location.touched) {
			if (inputs.location._data.city)
				newInfoFromState.city = inputs.location._data.city;
			if (inputs.location._data.county)
				newInfoFromState.county = inputs.location._data.county;
			if (inputs.location._data.zip)
				newInfoFromState.zip = inputs.location._data.zip;
			if (inputs.location._data.state)
				newInfoFromState.state = inputs.location._data.state;
			if (inputs.location._data.country)
				newInfoFromState.country = inputs.location._data.country;
		}

		if (Object.keys(newInfoFromState).length === 0) {
			return setSaveMessage('No new settings to update.');
		}

		//update profile information of user
		setSaveMessage('Saving...');
		db.collection('users')
			.doc(user.uid)
			.set(newInfoFromState, { merge: true })
			.then(() => {
				console.log('[Profile]: Document successfully updated in database!');

				//reset "touched" value of inputs so save isn't triggered again if attempted
				setInputs((prevState) => ({
					...prevState,
					activity: {
						...prevState.activity,
						touched: false,
					},
					instrument: {
						...prevState.instrument,
						touched: false,
					},
					bio: {
						...prevState.bio,
						touched: false,
					},
					website: {
						...prevState.website,
						touched: false,
					},
					location: {
						...prevState.location,
						touched: false,
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
				<Input
					type='text'
					customType='location'
					handleFocus={(e: React.FormEvent<HTMLInputElement>) =>
						handleFocus(e, 'location')
					}
					handleBlur={(e: React.FormEvent<HTMLInputElement>) =>
						handleBlur(e, 'location')
					}
					handleChange={(e: React.FormEvent<HTMLInputElement>) =>
						handleChange(e, 'location')
					}
					inputs={inputs}
					suggestionClickHandler={suggestionClickHandler}
				/>
				<Message
					message={locationMessage}
					color={locationMessage ? 'black' : 'hidden'}
				/>
				<Input
					type='text'
					customType='activity'
					handleFocus={(e: React.FormEvent<HTMLInputElement>) =>
						handleFocus(e, 'activity')
					}
					handleBlur={(e: React.FormEvent<HTMLInputElement>) =>
						handleBlur(e, 'activity')
					}
					handleChange={(e: React.FormEvent<HTMLInputElement>) =>
						handleChange(e, 'activity')
					}
					inputs={inputs}
					suggestionClickHandler={suggestionClickHandler}
				/>
				<Input
					type='text'
					customType='instrument'
					handleFocus={(e: React.FormEvent<HTMLInputElement>) =>
						handleFocus(e, 'instrument')
					}
					handleBlur={(e: React.FormEvent<HTMLInputElement>) =>
						handleBlur(e, 'instrument')
					}
					handleChange={(e: React.FormEvent<HTMLInputElement>) =>
						handleChange(e, 'instrument')
					}
					inputs={inputs}
					suggestionClickHandler={suggestionClickHandler}
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
				<Message
					message={saveMessage}
					color={saveMessage ? 'black' : 'hidden'}
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
