import React from 'react';
import styles from './Comment.module.scss';
import { CommentType } from '../../app/types';

export default ({
	uid,
	body,
	activity,
	createdAt,
	name,
	profilePic,
}: CommentType) => {
	return (
		<section className={styles.comment}>
			<img src={profilePic} alt='profile' className={styles.profilePic}></img>
			<header>
				<h3 className={styles.name}>{name}</h3>
				<time className={styles.time}>{createdAt}</time>
				<p className={styles.activity}>{activity}</p>
			</header>
			<main>
				<p className={styles.body}>{body}</p>
			</main>
		</section>
	);
};
