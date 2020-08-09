import React, { useEffect, useState } from 'react';
import styles from './Post.module.scss';
import { useAuth } from '../../util/AuthProvider';

//images
import heartEmpty from '../../assets/images/heartEmpty.svg';
import heartFull from '../../assets/images/heartFull.svg';
import commentEmpty from '../../assets/images/commentEmpty.svg';
import commentFull from '../../assets/images/commentFull.svg';

export default ({
	activity = '',
	body = '',
	city = '',
	comments = '',
	country = '',
	county = '',
	createdAt = '',
	likes = '',
	name = '',
	state = '',
	uid = '',
	zip = '',
}) => {
	const { user } = useAuth();

	return (
		<div className={styles.wrapper}>
			<article className={styles.article}>
				<header>
					<div className={styles.profilePic}></div>
					<h1 className={styles.name}>{name}</h1>
					<time>{new Date(createdAt).toLocaleString()}</time>
					<p className={styles.activity}>{activity}</p>
				</header>
				<main className={styles.body}>
					<p>{body}</p>
				</main>
				<footer>
					<p className={styles.likes}>
						<img alt='likes' src={heartFull}></img> {likes.length} likes
					</p>
					<p className={styles.comments}>
						<img alt='likes' src={commentFull}></img> {comments.length} comments
					</p>
					<div className={styles.icons}>
						<img alt='likes' src={heartFull}></img>{' '}
						<img alt='likes' src={commentFull}></img>{' '}
					</div>
				</footer>
			</article>
		</div>
	);
};
