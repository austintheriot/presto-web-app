import React from 'react';
import countries from '../app/countries';

export default () => {
	let optionArray = countries.map((el) => {
		return <option value={el} />;
	});
	return <datalist id='countries'>{optionArray}</datalist>;
};
