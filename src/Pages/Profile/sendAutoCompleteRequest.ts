import * as ProfileTypes from './ProfileTypes';
import geoapifyKey from 'app/geoapifyKey';
import cloneDeep from 'lodash/cloneDeep';

const updateLocationValues = (
	setInputs: ProfileTypes.SetInputs,
	collectedDataArray: ProfileTypes.CollectedDataArray,
	collectedDataString: string[]
) => {
	//update autocomplete suggestions for location input
	setInputs((prevState: ProfileTypes.Inputs) => {
		const newState = cloneDeep(prevState);
		const { location } = newState;
		location.suggestionsArray = collectedDataArray;
		location.suggestions.loading = false;
		location.suggestions.show = true;
		location.suggestions.array = collectedDataString;
		return newState;
	});
};

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
				setLocationMessage('');
			}
			//turn data into an array of objects for later recall
			let collectedDataArray: ProfileTypes.CollectedDataArray = geoapifyDataArray.map(
				({ properties }: ProfileTypes.GeoapifyData) => {
					return {
						city: properties.city || '',
						state: properties.state || '',
						//replace "United States of America" with "United States" for consistency"
						county: properties.county || '',
						zip: properties.postcode ? properties.postcode.split(';')[0] : '',
						country:
							properties.country === 'United States of America'
								? 'United States'
								: properties.country || '',
					};
				}
			);
			//format data to be usable for the suggestions drop down menu
			let collectedDataString = collectedDataArray.map((el) => {
				return [el.city, el.state, el.country, el.zip]
					.filter((el) => el)
					.join(', ')
					.trim();
			});

			updateLocationValues(setInputs, collectedDataArray, collectedDataString);
		}
	};
}
