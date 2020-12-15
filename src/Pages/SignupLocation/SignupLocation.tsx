import React, { useState } from 'react';
import { db } from 'app/config';
import Message from 'components/Message/Message';
import { Redirect, Link } from 'react-router-dom';
import Input from 'components/Inputs/Input';
import Button from 'components/Button/Button';
import geoapifyKey from 'app/geoapifyKey';
import styles from './SignupLocation.module.scss';
import ProgressBar from 'components/ProgressBar/ProgressBar';

import { useSelector } from 'react-redux';
import { selectUser } from 'app/userSlice';

import { HistoryType, InputType } from 'app/types';

import arrowLeft from 'assets/images/arrow-left.svg';
import arrowRight from 'assets/images/arrow-right.svg';
import SpacerSmall from 'components/Spacers/SpacerSmall';
import SpacerMedium from 'components/Spacers/SpacerMedium';

interface Inputs {
	location: InputType;
	city: InputType;
	county: InputType;
	state: InputType;
	zip: InputType;
	country: InputType;
}

type KeyOfInputs = keyof Inputs;

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

export default function Login(props: HistoryType) {
	window.scrollTo(0, 0);

	const user = useSelector(selectUser);
	const [inputs, setInputs] = useState<Inputs>({
		location: {
			label: 'Location',
			value: '',
			animateUp: false,
			empty: true,
			edited: false,
			suggestions: {
				selected: false,
				loading: false,
				array: [],
				show: false,
			},
			message: {
				error: false,
				text: 'e.g. Address/City/State/Zip Code, etc.',
				default: 'e.g. Address/City/State/Zip Code, etc.',
			},
		},
		city: {
			value: '',
			label: 'City',
			animateUp: false,
			empty: true,
			edited: false,
			suggestions: {
				selected: false,
				loading: false,
				array: [],
				show: false,
			},
			message: {
				error: false,
				text: '',
				default: '',
			},
		},
		county: {
			label: 'County',
			value: '',
			animateUp: false,
			empty: true,
			edited: false,
			suggestions: {
				selected: false,
				loading: false,
				array: [],
				show: false,
			},
			message: {
				error: false,
				text: '',
				default: '',
			},
		},
		state: {
			label: 'State',
			value: '',
			animateUp: false,
			empty: true,
			edited: false,
			suggestions: {
				selected: false,
				loading: false,
				array: [],
				show: false,
			},
			message: {
				error: false,
				text: '',
				default: '',
			},
		},
		zip: {
			label: 'Zip Code',
			value: '',
			animateUp: false,
			empty: true,
			edited: false,
			suggestions: {
				selected: false,
				loading: false,
				array: [],
				show: false,
			},
			message: {
				error: false,
				text: '',
				default: '',
			},
		},
		country: {
			label: 'Full Name',
			value: '',
			animateUp: false,
			empty: true,
			edited: false,
			suggestions: {
				selected: false,
				loading: false,
				array: [],
				show: false,
			},
			message: {
				error: false,
				text: '',
				default: '',
			},
		},
	});
	const [suggestions, setSuggestions] = useState<CollectedDataArray>([]);
	const [message, setMessage] = useState('');
	const [submitted, setSubmitted] = useState(false);
	const [timerId, setTimerId] = useState(setTimeout(() => {}, 0));

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
				edited: true,
			},
		}));
	};

	const handleBlur = (
		e: React.FormEvent<HTMLInputElement>,
		newestType: KeyOfInputs
	) => {
		//animation & output error if empty
		let targetEmpty =
			inputs[newestType]?.edited && inputs[newestType]?.value?.length === 0
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

		//validate inputs
		let anyErrorsObject = {
			location: '',
			city: '',
			county: '',
			state: '',
			zip: '',
			country: '',
		};

		setInputs((prevState: Inputs) => ({
			...prevState,
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
			city: {
				...prevState.city,

				//update generic values
				value: newestType === 'city' ? targetValue : prevState.city.value,
				empty: newestType === 'city' ? targetEmpty : prevState.city.empty,

				//update errors: If no error, set to default message
				message: {
					...prevState.city.message,
					error: anyErrorsObject.city ? true : false,
					text: anyErrorsObject.city
						? anyErrorsObject.city
						: prevState.city.message.default,
				},
			},
			county: {
				...prevState.county,

				//update generic values
				value: newestType === 'county' ? targetValue : prevState.county.value,
				empty: newestType === 'county' ? targetEmpty : prevState.county.empty,

				//update errors: If no error, set to default message
				message: {
					...prevState.county.message,
					error: anyErrorsObject.county ? true : false,
					text: anyErrorsObject.county
						? anyErrorsObject.county
						: prevState.county.message.default,
				},
			},
			state: {
				...prevState.state,

				//update generic values
				value: newestType === 'state' ? targetValue : prevState.state.value,
				empty: newestType === 'state' ? targetEmpty : prevState.state.empty,

				//update errors: If no error, set to default message
				message: {
					...prevState.state.message,
					error: anyErrorsObject.state ? true : false,
					text: anyErrorsObject.state
						? anyErrorsObject.state
						: prevState.state.message.default,
				},
			},
			zip: {
				...prevState.zip,

				//update generic values
				value: newestType === 'zip' ? targetValue : prevState.zip.value,
				empty: newestType === 'zip' ? targetEmpty : prevState.zip.empty,

				//update errors: If no error, set to default message
				message: {
					...prevState.zip.message,
					error: anyErrorsObject.zip ? true : false,
					text: anyErrorsObject.zip
						? anyErrorsObject.zip
						: prevState.zip.message.default,
				},
			},
			country: {
				...prevState.country,

				//update generic values
				value: newestType === 'country' ? targetValue : prevState.country.value,
				empty: newestType === 'country' ? targetEmpty : prevState.country.empty,

				//update errors: If no error, set to default message
				message: {
					...prevState.country.message,
					error: anyErrorsObject.country ? true : false,
					text: anyErrorsObject.country
						? anyErrorsObject.country
						: prevState.country.message.default,
				},
			},
		}));

		if (newestType === 'location' && targetValue) {
			let requestDelay = 500;
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
			setMessage(`Sorry, we couldn't find your location.`);
		};
		xhr.onload = () => {
			if (xhr.status !== 200) {
				// analyze HTTP status of the response
				console.error(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
			} else {
				//if the response succeeds:
				let geoapifyDataArray = xhr.response.features;

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
				//store suggestions for later access when list item is clicked
				setSuggestions(collectedDataArray);

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
						suggestions: {
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

	const suggestionClickHandler = (
		e: React.FormEvent<HTMLInputElement>,
		i: number
	) => {
		let selectedLocation = suggestions[i];

		setInputs((prevState: Inputs) => ({
			...prevState,
			location: {
				...prevState.location,
				//update generic values
				value: '',
				animateUp: false,
				empty: true,
				suggestions: {
					...prevState.location.suggestions,
					loading: false,
					show: false,
				},
			},
			city: {
				...prevState.city,
				//update generic values
				value: selectedLocation.city || '',
				animateUp: !!selectedLocation.city,
				empty: !!selectedLocation.city,
			},
			county: {
				...prevState.county,
				//update generic values
				value: selectedLocation.county || '',
				animateUp: !!selectedLocation.county,
				empty: !!selectedLocation.county,
			},
			zip: {
				...prevState.zip,
				//update generic values
				value: selectedLocation.zip || '',
				animateUp: !!selectedLocation.zip,
				empty: !!selectedLocation.zip,
			},
			state: {
				...prevState.state,
				//update generic values
				value: selectedLocation.state || '',
				animateUp: !!selectedLocation.state,
				empty: !!selectedLocation.state,
			},
			country: {
				...prevState.country,
				//update generic values
				value: selectedLocation.country || '',
				animateUp: !!selectedLocation.country,
				empty: !!selectedLocation.country,
			},
		}));

		setSuggestions([]);
		//allow click elsewhere to close suggestions menu
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
				setMessage(`Sorry, we couldn't find your location.`);
			};
			xhr.onload = (data) => {
				if (xhr.status !== 200) {
					// analyze HTTP status of the response
					console.error(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
				} else {
					//if the response succeeds:
					let properties = xhr.response.features[0].properties;
					//reduce info to necessary fields:
					let locationInfoObject = {
						lat: latitude,
						lon: longitude,
						city: properties.city,
						county: properties.county,
						state: properties.state,
						country: properties.country,
						zip: properties.postcode,
					};

					setInputs((prevState: Inputs) => ({
						...prevState,
						city: {
							...prevState.city,
							//update generic values
							value: locationInfoObject.city || '',
							animateUp: !!locationInfoObject.city,
							empty: !!locationInfoObject.city,
						},
						county: {
							...prevState.county,
							//update generic values
							value: locationInfoObject.county || '',
							animateUp: !!locationInfoObject.county,
							empty: !!locationInfoObject.county,
						},
						zip: {
							...prevState.zip,
							//update generic values
							value: locationInfoObject.zip || '',
							animateUp: !!locationInfoObject.zip,
							empty: !!locationInfoObject.zip,
						},
						state: {
							...prevState.state,
							//update generic values
							value: locationInfoObject.state || '',
							animateUp: !!locationInfoObject.state,
							empty: !!locationInfoObject.state,
						},
						country: {
							...prevState.country,
							//update generic values
							value: locationInfoObject.country || '',
							animateUp: !!locationInfoObject.country,
							empty: !!locationInfoObject.country,
						},
					}));
				}
			};
		};

		const handleGeolocationFail = (err: { code: any; message: any }) => {
			console.warn(`ERROR(${err.code}): ${err.message}`);
			setMessage(`Sorry, we couldn't find your location.`);
		};

		//if Geolocation is supported, call it (see above)
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				handleGeolocationSuccess,
				handleGeolocationFail,
				options
			);
		} else {
			setMessage('Geolocation is not supported by this browser.');
		}
	};

	const submitHandler = (e: React.SyntheticEvent) => {
		//prevent default form submission
		e.preventDefault();

		//if any one of the inputs are valid, update all location data in database
		//(you can't lingering bad location info hanging around. I.E. Lake Charles, Texas, USA)
		if (Object.values(inputs).find((el) => el.value)) {
			//update location of user
			db.collection('users')
				.doc(user.uid)
				.set(
					{
						city: inputs.city.value,
						county: inputs.county.value,
						state: inputs.state.value,
						zip: inputs.zip.value,
						country: inputs.country.value,
					},
					{ merge: true }
				)
				.then(() => {
					console.log('Document successfully written!');
					//redirect on successful submission
					setSubmitted(true);
				})
				.catch((error) => {
					console.error(error);
					setMessage('Server error. Please try again later.');
				});
		} else {
			setSubmitted(true);
		}
	};

	//top Message:
	let infoMessage = props.history?.location?.state?.infoMessage;

	return (
		//display Message message if redirected from another page requiring authentication:
		<>
			<div className={styles.SkipDiv}>
				<Link to='/signup-profile'>Skip</Link>
			</div>
			{submitted ? <Redirect to={'/signup-profile'} /> : null}
			<ProgressBar
				signup='complete'
				personal='complete'
				location='inProgress'
			/>
			<h1 className={styles.title}>Location</h1>
			<p className={styles.subtitle}>
				This information is public—we don't store or display your street
				address.
			</p>
			<br />
			<p className={styles.subtitle}>
				Sharing your general location allows you to write posts in the place
				that helps you the most (you can edit this later).
			</p>
			{infoMessage ? (
				<Message message={infoMessage} color={infoMessage ? 'black' : ''} />
			) : null}
			<Message message={message} color={message ? 'black' : ''} />
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
			<SpacerSmall />
			<form onSubmit={submitHandler}>
				<fieldset className={styles.fieldset}>
					<Input
						readOnly={true}
						type='text'
						customType='city'
						handleFocus={(e: React.FormEvent<HTMLInputElement>) =>
							handleFocus(e, 'city')
						}
						handleBlur={(e: React.FormEvent<HTMLInputElement>) =>
							handleBlur(e, 'city')
						}
						handleChange={(e: React.FormEvent<HTMLInputElement>) =>
							handleChange(e, 'city')
						}
						inputs={inputs}
					/>
					<Input
						readOnly={true}
						type='text'
						customType='county'
						handleFocus={(e: React.FormEvent<HTMLInputElement>) =>
							handleFocus(e, 'county')
						}
						handleBlur={(e: React.FormEvent<HTMLInputElement>) =>
							handleBlur(e, 'county')
						}
						handleChange={(e: React.FormEvent<HTMLInputElement>) =>
							handleChange(e, 'county')
						}
						inputs={inputs}
					/>
					<Input
						readOnly={true}
						type='text'
						customType='zip'
						handleFocus={(e: React.FormEvent<HTMLInputElement>) =>
							handleFocus(e, 'zip')
						}
						handleBlur={(e: React.FormEvent<HTMLInputElement>) =>
							handleBlur(e, 'zip')
						}
						handleChange={(e: React.FormEvent<HTMLInputElement>) =>
							handleChange(e, 'zip')
						}
						inputs={inputs}
					/>
					<Input
						readOnly={true}
						type='text'
						customType='state'
						handleFocus={(e: React.FormEvent<HTMLInputElement>) =>
							handleFocus(e, 'state')
						}
						handleBlur={(e: React.FormEvent<HTMLInputElement>) =>
							handleBlur(e, 'state')
						}
						handleChange={(e: React.FormEvent<HTMLInputElement>) =>
							handleChange(e, 'state')
						}
						inputs={inputs}
					/>
					<Input
						readOnly={true}
						type='text'
						customType='country'
						handleFocus={(e: React.FormEvent<HTMLInputElement>) =>
							handleFocus(e, 'country')
						}
						handleBlur={(e: React.FormEvent<HTMLInputElement>) =>
							handleBlur(e, 'country')
						}
						handleChange={(e: React.FormEvent<HTMLInputElement>) =>
							handleChange(e, 'country')
						}
						inputs={inputs}
					/>
				</fieldset>

				<div className={styles.buttonsDiv}>
					<Link to='/signup-personal' className={styles.linkLeft}>
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
			<SpacerMedium />
		</>
	);
}
