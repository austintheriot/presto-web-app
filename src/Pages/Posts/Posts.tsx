import React from 'react';
import Nav from '../../components/Nav/Nav';
import Post from '../../components/Post/Post';
import styles from './Posts.module.scss';
import { PostType } from '../../app/types';

import { useSelector } from 'react-redux';
import { selectUser } from '../../app/userSlice';
import { getPostData } from '../../app/postsSlice';

import locationIcon from '../../assets/images/location.svg';

interface State {
	posts: PostType[];
	status: string;
	error: string | null;
}

export default () => {
	const user = useSelector(selectUser);
	const postData = useSelector(getPostData);

	console.log('POST DATA', postData);

	return (
		<>
			<Nav />
			<h1 className={styles.title}>Posts</h1>
			{postData.status === 'idle' ? null : postData.status === 'loading' ? (
				<p>Loading posts...</p>
			) : postData.status === 'success' ? (
				<>
					<div className={styles.locationDiv}>
						<img src={locationIcon} alt='location' />{' '}
						<address>
							{user.city || user.state || user.country || 'United States'}:
						</address>
					</div>
					{Object.values(postData.postContainer).map((el: any, i: number) => {
						return <Post key={el.body || i} {...el} />;
					})}
				</>
			) : postData.status === 'failed' ? (
				<p>{postData.error}</p>
			) : null}
			<div className='spacerLarge'></div>
		</>
	);
};
