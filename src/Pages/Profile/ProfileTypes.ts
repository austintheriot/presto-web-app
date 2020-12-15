import { NewInputType } from 'app/types';

export interface GeoapifyData {
	properties: {
		city?: string;
		state?: string;
		county?: string;
		postcode?: string;
		country?: string;
	};
}

export interface LocationData {
	city?: string;
	state?: string;
	county?: string;
	zip?: string;
	country?: string;
}

export interface PositionData {
	coords: {
		latitude: number;
		longitude: number;
	};
}

export type CollectedDataArray = LocationData[];

export interface LocationType extends NewInputType {
	_data: {
		city: string;
		state: string;
		county: string;
		zip: string;
		country: string;
	};
	suggestionsArray: any[];
}

export interface Inputs {
	[key: string]: NewInputType;
	activity: NewInputType;
	instrument: NewInputType;
	website: NewInputType;
	bio: NewInputType;
	location: LocationType;
}

export type KeyOfInputs = keyof Inputs;

export interface NewInfoFromState {
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

export interface SetSaveMessage {
	(value: React.SetStateAction<string>): void;
}

export interface SetInputs {
	(value: React.SetStateAction<Inputs>): void;
}
