import React, { useState } from 'react';
import styles from './IndividualPost.module.scss';
import Post from '../../components/Post/Post';
import Nav from '../../components/Nav/Nav';
import Comments from '../../components/Comments/Comments';
import NewComment from '../../components/NewComment/NewComment';

import { useSelector, useDispatch } from 'react-redux';
import { getPostsData, fetchSinglePost } from '../../app/postsSlice';
import SpacerLarge from '../../components/Spacers/SpacerLarge';

export default () => {
	const dispatch = useDispatch();
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
								<NewComment postId={postId} />
								<Comments
									commentsContainer={postData.postContainer[postId]}
									postId={postId}
								/>
							</>
						) : null
					) : (
						//if postId DOES NOT exist in redux store:
						dispatch(fetchSinglePost(postId))
					)
				) : null
			}
			<SpacerLarge />
		</>
	);
};
