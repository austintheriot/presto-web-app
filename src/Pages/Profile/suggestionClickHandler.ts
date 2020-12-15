import * as ProfileTypes from './ProfileTypes';
import { NewInputType } from 'app/types';

export default function suggestionClickHandler(
	e: React.FormEvent<HTMLInputElement>,
	i: number,
	newestType: ProfileTypes.KeyOfInputs,
	input: NewInputType,
	setInputs: React.Dispatch<React.SetStateAction<ProfileTypes.Inputs>>
) {
	let newValue = input.suggestions.array[i];
	if (newestType === 'location') {
		const formattedData = newValue;
		const unformattedData = input.suggestionsArray[i];
		setInputs((prevState: ProfileTypes.Inputs) => ({
			...prevState,
			location: {
				...prevState.location,
				value: formattedData || '',
				empty: !formattedData,
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
				suggestions: {
					...prevState[newestType].suggestions,
					selected: true,
				},
			},
		}));
	}
}
