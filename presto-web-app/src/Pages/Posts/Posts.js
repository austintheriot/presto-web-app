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

	const fetchPosts = () => {
		let searchQueries = ['city', 'county', 'state', 'country']; //location terms to look for in user info
		let searchKey = searchQueries.find((key) => user[key]) || 'country'; //find the most specific location that is defined. Default to country.
		let searchValue = user[searchKey] || 'United States'; //define the corresponding search value. Default to United States.
		setLocation(searchValue);
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
					console.log('[Posts]: Posts received from database.');
					var posts = [];
					querySnapshot.forEach((doc) => {
						let post = { id: doc['id'], ...doc.data() };
						posts.push(post);
					});
					console.log(
						'[Posts]: Setting global posts with posts from database.'
					);
					setPosts(posts);
				},
				(error) => {
					console.error(error);
				}
			);
	};

	useEffect(() => {
		//only call new posts if posts is null
		if (!posts) {
			console.log('[Posts]: Calling fetchposts().');
			fetchPosts();
		}
	}, []);

	let postList = null;
	if (posts?.length === 0) {
		return <p>No posts found in your area. </p>;
	}
	if (posts?.length > 0) {
		postList = posts.map((el, i) => {
			return <Post key={el.body || i} {...el} />;
		});
	}

	return (
		<>
			<Nav />
			<h1 className={styles.title}>Posts</h1>
			{postList ? (
				<>
					<div className={styles.locationDiv}>
						<img src={locationIcon} alt='location' />{' '}
						<address>{location}</address>
					</div>
					{postList}
				</>
			) : (
				<p>Loading posts...</p>
			)}
			<div className='spacerLarge'></div>
		</>
	);
};
