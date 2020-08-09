import React, { useEffect, useState } from 'react';
import Nav from '../../components/Nav/Nav';
import Post from '../../components/Post/Post';
import { db } from '../../util/config';
import { useAuth } from '../../util/AuthProvider';

export default (props) => {
	const { user, posts, setPosts } = useAuth();
	const [location, setLocation] = useState('');

	const fetchPosts = () => {
		let searchQueries = ['city', 'county', 'state', 'country']; //location terms to look for in user info
		let searchKey = searchQueries.find((key) => user[key]) || 'country'; //find the most specific location that is defined. Default to country.
		let searchValue = user[searchKey] || 'United States'; //define the corresponding search value. Default to United States.
		setLocation(searchValue);
		console.log('Searching for: ', searchKey, searchValue);
		db.collection('posts')
			/* .orderBy('createdAt', 'desc') //create index to do this */
			/* .limit(20) */
			.where(searchKey, '==', searchValue)

			.onSnapshot((querySnapshot) => {
				var posts = [];
				querySnapshot.forEach((doc) => {
					posts.push(doc.data());
				});
				setPosts(posts);
			});
	};

	useEffect(() => {
		//only call new posts if posts is null
		if (!posts) {
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
			<h1>Posts</h1>
			{postList ? (
				<>
					<p>Showing posts from {location}</p>
					{postList}
				</>
			) : (
				<p>Loading posts...</p>
			)}
			<div className='spacerLarge'></div>
		</>
	);
};
