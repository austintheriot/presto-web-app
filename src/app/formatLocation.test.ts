import formatLocation from './formatLocation';

describe('Location Formatter', () => {
	let inputs = {
		city: 'Austin',
		state: 'Texas',
		country: 'United States',
	};
	test('city, state, country => City, State', () => {
		expect(formatLocation(inputs)).toBe('Austin, Texas');
	});

	test('state, country => State', () => {
		let inputs = { city: '', state: 'Texas', country: '' };
		expect(formatLocation(inputs)).toBe('Texas');
	});

	test('country => Country', () => {
		let inputs = { city: '', state: '', country: 'United State' };
		expect(formatLocation(inputs)).toBe('United State');
	});

	test('nothing => Location Unknown', () => {
		let inputs = { city: '', state: '', country: '' };
		expect(formatLocation(inputs)).toBe('Location Unknown');
	});
});
