import { createSlice } from '@reduxjs/toolkit';
import { db } from '../../app/config';
import extractPostInfoFromDoc from '../../app/extractPostInfoFromDoc';
import {
	PostContainer,
	PostType,
	PostsData,
	ReduxState,
} from '../../app/types';

export const postsSlice = createSlice({
	name: 'posts',
	initialState: {
		postData: {
			postContainer: {} as PostContainer,
			status: 'idle',
			error: '',
		},
	},
	reducers: {
		updatePostData: (state, action) => {
			state.postData = action.payload;
			console.log('updatePostData payload: ', action.payload);
		},
		likePost: (
			state,
			action: {
				type: string;
				payload: { userId: any; postId: any };
			}
		) => {
			let userId = action.payload.userId;
			let postId = action.payload.postId;
			let likes = state.postData.postContainer[postId].likes;
			if (likes[userId]) {
				return;
			} else {
				let newLikes = {
					...likes,
					count: likes.count + 1,
					[userId]: {
						uid: userId,
					},
				};
				state.postData.postContainer[postId].likes = newLikes;
				console.log('updating likes to: ', newLikes);
			}
		},
		unlikePost: (
			state,
			action: {
				type: string;
				payload: { userId: any; postId: any };
			}
		) => {
			let userId = action.payload.userId;
			let postId = action.payload.postId;
			let likes = state.postData.postContainer[postId].likes;
			if (!likes[userId]) {
				return;
			} else {
				let newLikes = {
					...likes,
					count: likes.count - 1,
					[userId]: false,
				};
				state.postData.postContainer[postId].likes = newLikes;
				console.log('updating likes to: ', newLikes);
			}
		},
	},
});

export const fetchPosts = (searchKey: string, searchValue: string) => (
	dispatch: Function,
	getState: Function
) => {
	let postsData: PostsData = {
		postContainer: {},
		status: 'loading',
		error: '',
	};
	dispatch(updatePostData(postsData));
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
					let postContainer: any = {};
					querySnapshot.forEach((doc) => {
						let post: PostType = extractPostInfoFromDoc(doc);
						postContainer[doc.id] = post;
					});
					console.log(
						'[postsSlice]: Setting posts state with posts from database.'
					);
					let postsData = {
						postContainer,
						status: 'success', //idle, loading, success, falied
						error: '',
					};
					dispatch(updatePostData(postsData));
					console.log('[postsSlice]: Posts data: ', postsData);
				} else {
					console.log(
						'[postsSlice]: No posts found. Displaying message instead.'
					);
					let postsData = {
						postContainer: {},
						status: 'failed', //idle, loading, success, failed
						error:
							'No posts found in your area. Try posting something to get people in your area talking!',
					};
					dispatch(updatePostData(postsData));
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
					postContainer: {},
					status: 'failed', //idle, loading, success, failed
					error: 'Sorry, there was an error. Please try again later.',
				};
				dispatch(updatePostData(postsData));
			}
		);
};

export const getPostData = (state: ReduxState) => state.posts.postsData;

export const { updatePostData, likePost, unlikePost } = postsSlice.actions;

export default postsSlice.reducer;
