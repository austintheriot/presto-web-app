import React, { useEffect, useState } from 'react';
import Nav from '../../components/Nav/Nav';
import Post from '../../components/Post/Post';
import { db } from '../../app/config';
import styles from './Posts.module.scss';
import { PostType } from '../../components/Post/Post';

import { useSelector } from 'react-redux';
import { selectUser } from '../../app/userSlice';

import locationIcon from '../../assets/images/location.svg';

interface State {
	posts: PostType[];
	status: string;
	error: string | null;
}

export default () => {
	const user = useSelector(selectUser);

	const [posts, setPosts] = useState<State>({
		posts: [],
		status: 'idle', //idle, loading, success, falied
		error: null,
	});

	const [location, setLocation] = useState('');

	//search for posts based on the most narrow geographic location first
	let searchKey: 'city' | 'state' | 'country';
	let searchValue: string;
	if (user.city) {
		searchKey = 'city';
		searchValue = user.city;
	} else if (user.state) {
		searchKey = 'state';
		searchValue = user.state;
	} else if (user.country) {
		searchKey = 'country';
		searchValue = user.country;
	} else {
		searchKey = 'country';
		searchValue = 'United States';
	}

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
						let posts: PostType[] = [];
						querySnapshot.forEach((doc) => {
							let post = { id: doc['id'], ...doc.data() }; //store doc id from database with the information it contains
							posts.push(post);
						});
						console.log(
							'[Posts]: Setting posts state with posts from database.'
						);
						setPosts({
							posts,
							status: 'success', //idle, loading, success, falied
							error: null,
						});
					} else {
						console.log('[Posts]: No posts found. Displaying message instead.');
						setPosts((prevState) => ({
							posts: [],
							status: 'failed', //idle, loading, complete, failed
							error:
								'No posts found in your area. Try posting something to get people in your area talking!',
						}));
					}
				},
				(error) => {
					console.log(
						'[Posts]: Error occured in reading from database. User probably logged out.'
					);
					//This causes a memory leak: (trying to update state on unmounted components
					//after being redirected to Login page):
					/* console.error(error); */
					/* setPosts((prevState) => ({
						posts: [],
						status: 'failed', //idle, loading, success, falied
						error: 'Sorry, there was an error. Please try again later.',
					})); */
				}
			);
	};

	useEffect(() => {
		//only call new posts if posts haven't been loaded yet
		if (posts.status === 'idle') {
			console.log('[Posts]: Calling fetchposts().');
			fetchPosts();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<Nav />
			<h1 className={styles.title}>Posts</h1>
			{posts.status === 'idle' ? null : posts.status === 'loading' ? (
				<p>Loading posts...</p>
			) : posts.status === 'success' ? (
				<>
					<div className={styles.locationDiv}>
						<img src={locationIcon} alt='location' />{' '}
						<address>{location || searchValue}:</address>
					</div>
					{posts.posts.map((el, i) => {
						return <Post key={el.body || i} {...el} />;
					})}
				</>
			) : posts.status === 'failed' ? (
				<p>{posts.error}</p>
			) : null}
			<div className='spacerLarge'></div>
		</>
	);
};
