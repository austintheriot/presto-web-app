import React, { useState, useEffect } from 'react';
import Nav from 'components/Nav/Nav';
import Post from 'components/Post/Post';
import NewPost from 'components/NewPost/NewPost';
import styles from './Posts.module.scss';
import { LocationDisplay } from 'components/LocationDisplay/LocationDisplay';

import { useSelector } from 'react-redux';
import { selectUser } from 'app/userSlice';
import { getPostsData } from 'app/postsSlice';

import SpacerLarge from 'components/Spacers/SpacerLarge';

export default () => {
	const user = useSelector(selectUser);
	const postsData = useSelector(getPostsData);
	const [posts, setPosts] = useState<any[]>([]);

	useEffect(() => {
		console.log('[Posts]: filtering posts and sorting by date.');
		let postsArray = Object.values(postsData.postContainer)
			//filter out any posts that have been loaded into Redux, but shouldn't be part of the feed
			.filter((post) => post.country === user.country)
			//sort by most recent at the top
			.sort((postA, postB) => {
				let a = new Date(postA.createdAt ? postA.createdAt : 0).getTime();
				let b = new Date(postB.createdAt ? postB.createdAt : 0).getTime();
				return b - a;
			})
			//convert post data into a Post component
			.map((el: any, i: number) => {
				return <Post key={el.uid + el.body + el.createdAt} {...el} />;
			});
		setPosts(postsArray);
	}, [postsData.postContainer, user.country]);

	return (
		<>
			<Nav />
			<h1 className={styles.title}>Posts</h1>
			{postsData.status === 'idle' ? null : postsData.status === 'loading' ? (
				<p className={styles.message}>Loading posts...</p>
			) : postsData.status === 'success' ? (
				<>
					<LocationDisplay user={user} />
					<NewPost />
					{posts}
					{}
				</>
			) : postsData.status === 'failed' ? (
				<p className={styles.message}>{postsData.error}</p>
			) : null}
			<SpacerLarge />
		</>
	);
};
