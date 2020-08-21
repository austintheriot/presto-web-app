import { createSlice } from '@reduxjs/toolkit';
import { db } from './config';
import extractPostInfoFromDoc from './extractPostInfoFromDoc';
import { PostContainer, PostType, PostsData, ReduxState } from './types';

interface SinglePost {
	post: PostType;
	status: string;
	error: string;
}

export const postsSlice = createSlice({
	name: 'posts',
	initialState: {
		postsData: {
			postContainer: {} as PostContainer,
			status: 'idle',
			error: '',
		},
	},
	reducers: {
		updatePostsData: (state, action) => {
			state.postsData = action.payload;
		},
		updateSinglePost: (state, action) => {
			state.postsData.postContainer[action.payload.id] = action.payload;
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
			let likes = state.postsData.postContainer[postId].likes;
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
				state.postsData.postContainer[postId].likes = newLikes;
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
			let likes = state.postsData.postContainer[postId].likes;
			if (!likes[userId]) {
				return;
			} else {
				let newLikes = {
					...likes,
					count: likes.count - 1,
					[userId]: false,
				};
				state.postsData.postContainer[postId].likes = newLikes;
			}
		},
		addComment: (state, action) => {
			let postId = action.payload.postId;
			let commentId = action.payload.commentId;
			let commentData = action.payload.commentData;

			/* state.postsData = action.payload; */
			state.postsData.postContainer[postId].comments[commentId] = commentData;
			state.postsData.postContainer[postId].comments.count += 1;
		},
		deleteComment: (state, action) => {
			/* state.postsData = action.payload; */
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
	dispatch(updatePostsData(postsData));
	console.log(
		'[postsSlice]: Searching database for posts where: ',
		searchKey,
		'== ',
		searchValue
	);
	db.collection('posts')
		.where(searchKey, '==', searchValue)
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
					dispatch(updatePostsData(postsData));
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
					dispatch(updatePostsData(postsData));
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
				dispatch(updatePostsData(postsData));
			}
		);
};

export const fetchSinglePost = (postId: string) => (
	dispatch: Function,
	getState: Function
) => {
	console.log('[postsSlice]: Searching database for posts with Id: ', postId);
	let singlePostData: PostType = {
		id: postId,
		status: 'loading',
		error: '',
		uid: '',
		comments: {
			count: 0,
		},
		likes: {
			count: 0,
		},
	};
	dispatch(updateSinglePost(singlePostData));
	db.collection('posts')
		.doc(postId)
		.onSnapshot(
			(doc) => {
				if (doc.exists) {
					console.log('[postsSlice]: Single post received from database.');
					let post: PostType = extractPostInfoFromDoc(doc);
					console.log(
						'[postsSlice]: Setting posts state with posts from database.'
					);
					singlePostData = {
						...post,
						status: 'success',
						error: '',
					};
					dispatch(updateSinglePost(singlePostData));
				} else {
					console.log(
						'[postsSlice]: Single post not found. Displaying message instead.'
					);
					singlePostData = {
						id: postId,
						status: 'failed',
						error: 'Post not found.',
						uid: '',
						comments: {
							count: 0,
						},
						likes: {
							count: 0,
						},
					};
					dispatch(updateSinglePost(singlePostData));
				}
			},
			(error) => {
				console.log(
					'[postsSlice]: Error occured in reading from database. User probably logged out.'
				);
				//This causes a memory leak: (trying to update state on unmounted components
				//after being redirected to Login page):
				console.error(error);
				singlePostData = {
					id: postId,
					status: 'failed',
					error: 'Server error. Please try again later.',
					uid: '',
					comments: {
						count: 0,
					},
					likes: {
						count: 0,
					},
				};
				dispatch(updateSinglePost(singlePostData));
			}
		);
};

export const getPostsData = (state: ReduxState) => state.posts.postsData;

export const {
	updatePostsData,
	updateSinglePost,
	likePost,
	unlikePost,
	addComment,
	deleteComment,
} = postsSlice.actions;

export default postsSlice.reducer;
