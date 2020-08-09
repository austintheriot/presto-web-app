import React, { useState, useEffect } from 'react';
import styles from './IndividualPost.module.scss';
import * as firebase from 'firebase/app';
import 'firebase/firebase-firestore';
import { db } from '../../util/config';
import Post from '../../components/Post/Post';
import Nav from '../../components/Nav/Nav';
import { useAuth } from '../../util/AuthProvider';
import Comments from '../../components/Comments/Comments';

export default (props) => {
	const [post, setPost] = useState({ init: false, valid: false });

	let postID = window.location.pathname.split('/posts/')[1];
	const fetchPost = () => {
		console.log(
			'[Individual Post]: Searching database for doc with ID of: ',
			postID
		);
		db.collection('posts')
			.where(firebase.firestore.FieldPath.documentId(), '==', postID)
			.onSnapshot(
				(querySnapshot) => {
					console.log('[IndividualPost]: Post data recieved');
					//if URL leads to a valid post:
					if (!querySnapshot.isEmpty) {
						querySnapshot.forEach((doc) => {
							console.log('[IndividualPost]: setting post with doc.data()');
							let post = { init: true, valid: true, ...doc.data() };
							setPost(post);
						});
					}

					//else if URL does not lead to a valid post:
					else {
						console.log('[IndividualPost]: Setting post as invalid');
						setPost({ init: true, valid: false });
					}
				},

				//if an error occurs:
				(error) => {
					console.error(error);
					setPost({ init: true, valid: false });
				}
			);
	};

	useEffect(() => {
		fetchPost();
	}, []);

	return (
		<>
			<Nav />
			{
				//Post initialized yet?
				!post.init ? (
					<p>Loading post...</p>
				) : //Once post is initialized, is it valid?
				post.valid ? (
					<>
						<Post {...post} />
						<Comments {...post} />
					</>
				) : (
					//Once post is initialized, if it's not valid, show post not found.
					<p className={styles.errorMessage}>
						Sorry, no post found at this URL.
					</p>
				)
			}
		</>
	);
};
