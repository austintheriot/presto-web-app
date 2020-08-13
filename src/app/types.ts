import { TimestampType as ImportedTimestampType } from './config';

export interface InputType {
	label: string;
	value: string;
	animateUp: boolean;
	empty: boolean;
	touched: boolean;
	message: {
		error: boolean;
		text: string;
		default: string;
	};
	suggestions: {
		loading: boolean;
		show: boolean;
		array: string[];
	};
}

export interface CommentType {
	activity?: string;
	body?: string;
	createdAt?: TimestampType;
	name?: string;
	profilePic?: string;
	uid?: string;
}

export interface PostType {
	id?: string;
	activity?: string;
	body?: string;
	city?: string;
	comments?: CommentType[];
	country?: string;
	county?: string;
	createdAt?: TimestampType;
	likes?: string[];
	name?: string;
	profilePic?: string;
	state?: string;
	uid?: string;
	zip?: string;
}

export interface HistoryType {
	history?: {
		location?: {
			state?: {
				infoMessage?: string;
			};
		};
	};
}

export type TimestampType = ImportedTimestampType;
