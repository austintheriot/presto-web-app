import React, { useEffect, useState } from 'react';
import Nav from '../../components/Nav/Nav';
import Post from '../../components/Post/Post';
import { db } from '../../util/config';
import { useAuth } from '../../util/AuthProvider';
import styles from './Posts.module.scss';

import locationIcon from '../../assets/images/location.svg';

export default (props) => {
	const { user, posts, setPosts } = useAuth();
	const [location, setLocation] = useState('');

	let searchQueries = ['city', 'state', 'country']; //location terms to look for in user info
	let searchKey = searchQueries.find((key) => user[key]) || 'country'; //find the most specific location that is defined. Default to country.
	let searchValue = user[searchKey] || 'United States'; //define the corresponding search value. Default to United States.

	const fetchPosts = () => {
		setLocation(searchValue);
		setPosts((prevState) => ({
			...prevState, //keep any posts or error messages already there, show loading screen
			status: 'loading', //idle, loading, complete, failed
		}));
		console.log(
			'[Posts]: Searching database for posts where: ',
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
						console.log('[Posts]: Posts received from database.');
						let posts = [];
						querySnapshot.forEach((doc) => {
							let post = { id: doc['id'], ...doc.data() }; //store doc id from database with the information it contains
							posts.push(post);
						});
						console.log(
							'[Posts]: Setting global posts with posts from database.'
						);
						setPosts((prevState) => ({
							posts,
							status: 'complete', //idle, loading, complete, falied
							error: null,
						}));
					} else {
						console.log('[Posts]: No posts found. Displaying message instead.');
						setPosts((prevState) => ({
							...prevState, //keep any posts already loaded, show error
							status: 'failed', //idle, loading, complete, failed
							error:
								'No posts found in your area. Try posting something to get people in your area talking!',
						}));
					}
				},
				(error) => {
					console.log(
						'[Posts]: Error occured. Displaying error message to user.'
					);
					console.error(error);
					setPosts((prevState) => ({
						...prevState, //keep any posts already loaded, show error
						status: 'failed', //idle, loading, complete, falied
						error: 'Sorry, there was an error. Please try again later.',
					}));
				}
			);
	};

	useEffect(() => {
		//only call new posts if posts haven't been loaded yet
		if (posts.status === 'idle') {
			console.log('[Posts]: Calling fetchposts().');
			fetchPosts();
		}
	}, []);

	let postList = null;
	postList = posts.posts.map((el, i) => {
		return <Post key={el.body || i} {...el} />;
	});

	return (
		<>
			<Nav />
			<h1 className={styles.title}>Posts</h1>
			{posts.status === 'idle' ? null : posts.status === 'loading' ? (
				<p>Loading posts...</p>
			) : posts.status === 'complete' ? (
				<>
					<div className={styles.locationDiv}>
						<img src={locationIcon} alt='location' />{' '}
						<address>{location || searchValue}:</address>
					</div>
					{postList}
				</>
			) : posts.status === 'failed' ? (
				<p>{posts.error}</p>
			) : null}
			<div className='spacerLarge'></div>
		</>
	);
};
