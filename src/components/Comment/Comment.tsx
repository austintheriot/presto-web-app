import React from 'react';
import styles from './Comment.module.scss';
import { CommentType } from '../../app/types';
import { db } from '../../app/config';

import { useDispatch, useSelector } from 'react-redux';
import { deleteComment } from '../../app/postsSlice';
import { selectUser } from '../../app/userSlice';

import trashIcon from '../../assets/images/delete.svg';
import editIcon from '../../assets/images/edit.svg';
import moreIcon from '../../assets/images/more.svg';

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
	const user = useSelector(selectUser);

	const deleteCommentHandler = () => {
		if (window.confirm('Are you sure you want to delete this comment?')) {
			db.collection('posts')
				.doc(postId)
				.collection('comments')
				.doc(commentId)
				.delete()
				.then(() => {
					console.log('[Comment]: Comment successfully deleted from database!');
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
		}
	};

	const editCommentHandler = () => {};

	return (
		<section className={styles.comment}>
			<img src={profilePic} alt='profile' className={styles.profilePic}></img>
			<header>
				<h3 className={styles.name}>{name}</h3>
				<time className={styles.time}>{createdAt}</time>
				<p className={styles.activity}>{activity}</p>
				{user.uid === uid ? (
					<>
						<div className={styles.more}>
							<button>
								<img src={moreIcon} alt='more' />
							</button>
							<div className={styles.hiddenMenu}>
								<button onClick={editCommentHandler}>
									<img src={editIcon} alt='edit' />
								</button>
								<button onClick={deleteCommentHandler}>
									<img src={trashIcon} alt='delete' />
								</button>
							</div>
						</div>
					</>
				) : null}
			</header>
			<main>
				<p className={styles.body}>{body}</p>
			</main>
		</section>
	);
};
