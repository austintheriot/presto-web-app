import React from 'react';
import styles from './Comment.module.scss';

export default ({ uid, body, activity, createdAt, name, profilePic }) => {
	return (
		<section className={styles.comment}>
			<img src={profilePic} alt='profile' className={styles.profilePic}></img>
			<header>
				<h3 className={styles.name}>{name}</h3>
				<time className={styles.time}>
					{createdAt.toDate().toLocaleString()}
				</time>
				<p className={styles.activity}>{activity}</p>
			</header>
			<main>
				<p className={styles.body}>{body}</p>
			</main>
		</section>
	);
};
