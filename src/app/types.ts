import { TimestampType as ImportedTimestampType } from './config';
import { User } from 'firebase';

export interface UserPayload {
	//necessary for initializing app (loading screen etc.):
	authenticated: boolean;
	init: boolean;
	status: string;
	error: string | null;
	uid: string | ''; //necessary to be declared as a string, regardless of if that string is empty or not

	//optional data received after auth and database requests:
	likes?: {
		[string: string]: boolean;
	};
	comments?: {
		[string: string]: boolean;
	};
	email?: string;
	displayName?: string;
	emailVerified?: false;
	photoUrl?: string;
	isAnonymous?: false;
	activity?: string;
	bio?: string;
	city?: string;
	country?: string;
	county?: string;
	instrument?: string;
	name?: string;
	state?: string;
	type?: string;
	website?: string;
	zip?: string;
	createdAt?: string;
}

export interface PostType {
	//used for showing statuses on individual posts while they're loading
	status: 'idle' | 'loading' | 'success' | 'failed';
	error: string;

	uid: string;
	id: string;
	comments: any;
	likes: any;
	createdAt?: TimestampType;

	activity?: string;
	body?: string;
	city?: string;
	country?: string;
	county?: string;
	name?: string;
	profilePic?: string;
	state?: string;
	zip?: string;
}

export interface PostContainer {
	[postId: string]: PostType;
}

export interface PostsData {
	//necessary for initializing app (loading screen etc.):
	postContainer: PostContainer;

	//used to show status when loading loading main body Posts into app
	status: 'idle' | 'loading' | 'success' | 'failed';
	error: string;
}

export interface ReduxState {
	user: {
		user: UserPayload;
	};
	posts: {
		postsData: PostsData;
	};
}

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
	uid?: string;
	activity?: string;
	body?: string;
	createdAt?: TimestampType;
	name?: string;
	profilePic?: string;
}

export interface LikeType {
	uid?: string;
}

interface UserAuthenticated extends User {
	authenticated?: boolean;
}

export type UserAuthenticationInfoType = UserAuthenticated | null;

export interface ProfileType {
	uid?: string;
	profilePic?: string;
	activity?: string;
	bio?: string;
	city?: string;
	country?: string;
	county?: string;
	instrument?: string;
	name?: string;
	state?: string;
	type?: string;
	website?: string;
	zip?: string;
	createdAt?: TimestampType;
}

export interface HistoryType {
	history?: {
		location?: {
			state?: {
				infoMessage?: string;
				redirect?: string;
			};
		};
	};
}

export type TimestampType = ImportedTimestampType;
