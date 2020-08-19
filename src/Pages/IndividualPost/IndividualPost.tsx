import React, { useState } from 'react';
import styles from './IndividualPost.module.scss';
import { db, documentId } from '../../app/config';
import Post from '../../components/Post/Post';
import Nav from '../../components/Nav/Nav';
import Comments from '../../components/Comments/Comments';

import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../app/userSlice';
import { getPostsData, fetchSinglePost } from '../../app/postsSlice';

import { PostType } from '../../app/types';

interface State {
	post: PostType;
	status: 'idle' | 'loading' | 'success' | 'failed';
	error: string | null;
}

interface SinglePostStatus {
	status: 'idle' | 'loading' | 'success' | 'failed';
	error: '';
}

export default () => {
	const dispatch = useDispatch();
	const user = useSelector(selectUser);
	const postData = useSelector(getPostsData);
	const [postId] = useState(window.location.pathname.split('/posts/')[1]);

	return (
		<>
			<Nav />
			{
				//if general post data is anything but success:
				postData.status === 'idle' ? null : postData.status === 'loading' ? (
					<p className={styles.message}>Loading post...</p>
				) : postData.status === 'failed' ? (
					<p className={styles.message}>{postData.error}</p>
				) : postData.status === 'success' ? (
					//if general post data has already loaded
					//if postId exists in redux store:
					postData.postContainer[postId] ? (
						//if post does not exist in redux store:
						postData.postContainer[postId].status === 'idle' ? (
							<p className={styles.message}>Loading post...</p>
						) : postData.postContainer[postId].status === 'loading' ? (
							<p className={styles.message}>Loading post...</p>
						) : postData.postContainer[postId].status === 'failed' ? (
							<p className={styles.message}>Post not found.</p>
						) : postData.postContainer[postId].status === 'success' ? (
							<>
								<Post {...postData.postContainer[postId]} />
								<Comments {...postData.postContainer[postId]} />
							</>
						) : null
					) : (
						//if postId DOES NOT exist in redux store:
						dispatch(fetchSinglePost(postId))
					)
				) : null
			}
		</>
	);
};
