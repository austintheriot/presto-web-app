import locationFormatter from './locationFormatter';

describe('Location Formatter', () => {
	let inputs = {
		city: 'Austin',
		state: 'Texas',
		country: 'United States',
	};
	test('city, state, country => City, State', () => {
		expect(locationFormatter(inputs)).toBe('Austin, Texas');
	});

	test('state, country => State', () => {
		let inputs = { city: '', state: 'Texas', country: '' };
		expect(locationFormatter(inputs)).toBe('Texas');
	});

	test('country => Country', () => {
		let inputs = { city: '', state: '', country: 'United State' };
		expect(locationFormatter(inputs)).toBe('United State');
	});

	test('nothing => Location Unknown', () => {
		let inputs = { city: '', state: '', country: '' };
		expect(locationFormatter(inputs)).toBe('Location Unknown');
	});
});
