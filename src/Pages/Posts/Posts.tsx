import React from 'react';
import Nav from '../../components/Nav/Nav';
import Post from '../../components/Post/Post';
import styles from './Posts.module.scss';
import { PostType } from '../../app/types';

import { useSelector } from 'react-redux';
import { selectUser } from '../../app/userSlice';
import { selectPosts } from '../../app/postsSlice';

import locationIcon from '../../assets/images/location.svg';

interface State {
	posts: PostType[];
	status: string;
	error: string | null;
}

export default () => {
	const user = useSelector(selectUser);
	const posts = useSelector(selectPosts);

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
						<address>
							{user.city || user.state || user.country || 'United States'}:
						</address>
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
