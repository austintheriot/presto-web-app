import * as ProfileTypes from './ProfileTypes';
import geoapifyKey from 'app/geoapifyKey';

export default function sendAutoCompleteRequest(
	setLocationMessage: React.Dispatch<React.SetStateAction<string>>,
	clearLocationSuggestions: () => void,
	setInputs: React.Dispatch<React.SetStateAction<ProfileTypes.Inputs>>,
	locationInputValue: string
) {
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
			console.log(geoapifyDataArray);
			//turn data into an array of objects for later recall
			let collectedDataArray: ProfileTypes.CollectedDataArray = geoapifyDataArray.map(
				({ properties }: ProfileTypes.GeoapifyData) => {
					return {
						city: properties.city || '',
						state: properties.state || '',
						county: properties.county || '',
						zip: properties.postcode ? properties.postcode.split(';')[0] : '',
						country: properties.country || '',
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
			setInputs((prevState: ProfileTypes.Inputs) => ({
				...prevState,
				location: {
					...prevState.location,
					suggestionsArray: collectedDataArray,
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
}
