import React from 'react';
import styles from './Comment.module.scss';
import { CommentType } from '../../app/types';
import { db } from '../../app/config';

import { useDispatch } from 'react-redux';
import { deleteComment } from '../../app/postsSlice';

import trashIcon from '../../assets/images/delete.svg';

export default ({
	commentId,
	postId,
	uid,
	body,
	activity,
	createdAt,
	name,
	profilePic,
}: CommentType) => {
	const dispatch = useDispatch();

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
				<button
					onClick={() => {
						db.collection('posts')
							.doc(postId)
							.collection('comments')
							.doc(commentId)
							.delete()
							.then(() => {
								console.log(
									'[Comment]: Comment successfully deleted from database!'
								);
								dispatch(
									deleteComment({
										postId,
										commentId,
									})
								);
							})
							.catch((err) => {
								console.error(err);
							});
					}}>
					<img src={trashIcon} alt='delete' />
				</button>
			</main>
		</section>
	);
};
