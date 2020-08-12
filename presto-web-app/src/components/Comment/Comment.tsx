import React from 'react';
import styles from './Comment.module.scss';
import { TimestampType } from '../../app/config';

export interface CommentType {
	activity?: string;
	body?: string;
	createdAt?: TimestampType;
	name?: string;
	profilePic?: string;
	uid?: string;
}

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
				<time className={styles.time}>
					{createdAt ? createdAt.toDate().toLocaleString() : null}
				</time>
				<p className={styles.activity}>{activity}</p>
			</header>
			<main>
				<p className={styles.body}>{body}</p>
			</main>
		</section>
	);
};
