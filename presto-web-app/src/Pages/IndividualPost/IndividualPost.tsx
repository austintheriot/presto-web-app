import React, { useState, useEffect } from 'react';
import styles from './IndividualPost.module.scss';
import * as firebase from 'firebase/app';
import 'firebase/firebase-firestore';
import { db } from '../../app/config';
import Post, { PostType } from '../../components/Post/Post';
import Nav from '../../components/Nav/Nav';
import Comments from '../../components/Comments/Comments';

interface State {
	post: PostType;
	status: 'idle' | 'loading' | 'success' | 'failed';
	error: string | null;
}

export default () => {
	const [post, setPost] = useState<State>({
		post: {},
		status: 'idle',
		error: null,
	});

	let postID = window.location.pathname.split('/post/')[1];
	const fetchPost = () => {
		console.log(
			'[Individual Post]: Searching database for doc with ID of: ',
			postID
		);
		setPost((prevState) => ({
			...prevState, //keep any info or error messages already there, show loading screen
			status: 'loading', //idle, loading, complete, failed
		}));
		db.collection('posts')
			.where(firebase.firestore.FieldPath.documentId(), '==', postID)
			.onSnapshot(
				(querySnapshot) => {
					console.log('[IndividualPost]: Post data recieved');
					//if URL leads to a valid post:
					if (!querySnapshot.empty) {
						querySnapshot.forEach((doc) => {
							console.log('[IndividualPost]: setting post with doc.data()');
							let post = { id: doc['id'], ...doc.data() };
							setPost({
								post,
								status: 'success', //idle, loading, success, falied
								error: null,
							});
						});
					}

					//else if URL does not lead to a valid post:
					else {
						console.log(
							'[IndividualPost]: No posts found. Displaying message instead.'
						);
						setPost((prevState) => ({
							...prevState, //keep any posts already loaded, show error
							status: 'failed', //idle, loading, complete, failed
							error: 'No post found at this URL',
						}));
					}
				},

				//if an error occurs:
				(error) => {
					console.log(
						'[IndividualPost]: Error occured. Displaying error message to user. (User probably logged out)'
					);
					/* console.error(error);
					setPost((prevState) => ({
						...prevState, //keep any posts already loaded, show error
						status: 'failed', //idle, loading, success, falied
						error: 'Sorry, there was an error. Please try again later.',
					})); */
				}
			);
	};

	useEffect(() => {
		if (post.status === 'idle') {
			fetchPost();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<Nav />
			{post.status === 'idle' ? null : post.status === 'loading' ? (
				<p className={styles.message}>Loading post...</p>
			) : post.status === 'success' ? (
				<>
					<Post {...post.post} />
					<Comments {...post.post} />
				</>
			) : post.status === 'failed' ? (
				<p className={styles.message}>{post.error}</p>
			) : (
				<p className={styles.message}>Sorry, there was an error.</p>
			)}
		</>
	);
};
