import * as ProfileTypes from './ProfileTypes';

export default (
	e: React.FormEvent<HTMLInputElement>,
	newestType: ProfileTypes.KeyOfInputs,
	setInputs: React.Dispatch<React.SetStateAction<ProfileTypes.Inputs>>
) => {
	//animation
	if (
		newestType === 'activity' ||
		newestType === 'instrument' ||
		newestType === 'location'
	) {
		//show drop down menu
		setInputs((prevState: ProfileTypes.Inputs) => ({
			...prevState,
			[newestType]: {
				...prevState[newestType],
				suggestions: {
					...prevState[newestType].suggestions,
					loading: false,
					show: true,
				},
			},
		}));
	} else {
		setInputs((prevState: ProfileTypes.Inputs) => ({
			...prevState,
			[newestType]: {
				...prevState[newestType],
				edited: true,
			},
		}));
	}
};
