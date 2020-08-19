import React from 'react';
import Nav from '../../components/Nav/Nav';
import Post from '../../components/Post/Post';
import styles from './Posts.module.scss';
import { PostType } from '../../app/types';

import { useSelector } from 'react-redux';
import { selectUser } from '../../app/userSlice';
import { getPostsData } from '../../app/postsSlice';

import locationIcon from '../../assets/images/location.svg';

interface State {
	posts: PostType[];
	status: string;
	error: string | null;
}

export default () => {
	const user = useSelector(selectUser);
	const postsData = useSelector(getPostsData);

	return (
		<>
			<Nav />
			<h1 className={styles.title}>Posts</h1>
			{postsData.status === 'idle' ? null : postsData.status === 'loading' ? (
				<p className={styles.message}>Loading posts...</p>
			) : postsData.status === 'success' ? (
				<>
					<div className={styles.locationDiv}>
						<img src={locationIcon} alt='location' />{' '}
						<address>
							{user.city || user.state || user.country || 'United States'}:
						</address>
					</div>
					{Object.values(postsData.postContainer)
						//filter out any posts that have been loaded into Redux, but shouldn't be part of the feed
						.filter(
							(post) => post.city === user.city || post.state === user.state
						)
						//convert post data into a Post component
						.map((el: any, i: number) => {
							return <Post key={el.body || i} {...el} />;
						})}
				</>
			) : postsData.status === 'failed' ? (
				<p className={styles.message}>{postsData.error}</p>
			) : null}
			<div className='spacerLarge'></div>
		</>
	);
};
