import { createSlice } from '@reduxjs/toolkit';
import { db } from './config';
import extractPostInfoFromDoc from './extractPostInfoFromDoc';
import { PostType } from './types';

interface PostsPayload {
	//necessary for initializing app (loading screen etc.):
	posts: PostType[];
	status: 'idle' | 'loading' | 'success' | 'failed';
	error: string;
}

interface PostsSlice {
	posts: {
		posts: PostsPayload;
	};
}

export const postsSlice = createSlice({
	name: 'posts',
	initialState: {
		posts: [],
		status: 'idle',
		error: '',
	},
	reducers: {
		updatePosts: (state, action) => {
			state.posts = action.payload;
		},
	},
});

export const fetchPosts = (searchKey: string, searchValue: string) => (
	dispatch: Function,
	getState: Function
) => {
	let postsData: PostsPayload = {
		posts: [],
		status: 'loading',
		error: '',
	};
	dispatch(updatePosts(postsData));
	console.log(
		'[postsSlice]: Searching database for posts where: ',
		searchKey,
		'== ',
		searchValue
	);
	db.collection('posts')
		.where(searchKey, '==', searchValue)
		/* .orderBy('createdAt', 'desc') //create index to do this */
		.limit(20)
		.onSnapshot(
			(querySnapshot) => {
				if (!querySnapshot.empty) {
					console.log('[postsSlice]: Posts received from database.');
					let posts: PostType[] = [];
					querySnapshot.forEach((doc) => {
						let post = extractPostInfoFromDoc(doc);
						posts.push(post);
					});
					console.log(
						'[postsSlice]: Setting posts state with posts from database.'
					);
					let postsData = {
						posts,
						status: 'success', //idle, loading, success, falied
						error: '',
					};
					dispatch(updatePosts(postsData));
					console.log('[postsSlice]: Posts data: ', postsData);
				} else {
					console.log(
						'[postsSlice]: No posts found. Displaying message instead.'
					);
					let postsData = {
						posts: [],
						status: 'failed', //idle, loading, success, failed
						error:
							'No posts found in your area. Try posting something to get people in your area talking!',
					};
					dispatch(updatePosts(postsData));
				}
			},
			(error) => {
				console.log(
					'[postsSlice]: Error occured in reading from database. User probably logged out.'
				);
				//This causes a memory leak: (trying to update state on unmounted components
				//after being redirected to Login page):
				console.error(error);
				let postsData = {
					posts: [],
					status: 'failed', //idle, loading, success, failed
					error: 'Sorry, there was an error. Please try again later.',
				};
				dispatch(updatePosts(postsData));
			}
		);
};

export const selectPosts = (state: PostsSlice) => state.posts.posts;

export const { updatePosts } = postsSlice.actions;

export default postsSlice.reducer;
