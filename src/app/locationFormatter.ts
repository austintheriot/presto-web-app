export default ({
	city,
	state,
	country,
}: {
	city: string;
	state: string;
	country: string;
}) => {
	if (city) {
		return `${city}, ${state}`;
	} else if (state) {
		return state;
	} else if (country) {
		return country;
	} else {
		return `Location Unknown`;
	}
};
