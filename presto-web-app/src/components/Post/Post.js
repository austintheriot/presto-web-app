import React from 'react';
import styles from './Post.module.scss';
import { useAuth } from '../../util/AuthProvider';
import { Link } from 'react-router-dom';

//images
import heartEmpty from '../../assets/images/heartEmpty.svg';
import heartFull from '../../assets/images/heartFull.svg';
import commentEmpty from '../../assets/images/commentEmpty.svg';
import commentFull from '../../assets/images/commentFull.svg';

export default ({
	id,
	activity,
	body,
	city,
	comments,
	country,
	county,
	createdAt,
	likes,
	name,
	profilePic = 'https://images.pexels.com/photos/922376/pexels-photo-922376.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
	state,
	uid,
	zip,
}) => {
	const { user } = useAuth();

	return (
		<div className={styles.wrapper}>
			<article className={styles.article}>
				<header>
					{/* PROFILE PIC*/}
					<div className={styles.profilePic}>
						<img alt='profile picture' src={profilePic} />
					</div>
					{/* NAME */}
					<h1 className={styles.name}>{name}</h1>
					{/* TIME */}
					<time>{new Date(createdAt).toLocaleString()}</time>
					<p className={styles.activity}>{activity}</p>
				</header>
				{/* BODY */}
				<main className={styles.body}>
					<p>{body}</p>
				</main>
				<footer>
					{/* NUMBER OF LIKES */}
					<p className={styles.likes}>
						<img alt='likes' src={heartFull}></img> {likes.length} likes
					</p>
					{/* NUMBER OF COMMENTS */}
					<Link
						to={`posts/${id}`}
						className={[styles.Link, styles.comments].join(' ')}>
						<img alt='likes' src={commentFull}></img> {comments.length} comments
					</Link>
					<div className={styles.icons}>
						{/* LIKE BUTTON */}

						{likes.includes(user.uid) ? (
							<img alt='likes' src={heartFull}></img>
						) : (
							<img alt='likes' src={heartEmpty}></img>
						)}

						{/* COMMENT BUTTON */}
						<Link to={`posts/${id}`} className={styles.Link}>
							{comments.map((el) => el.uid).includes(user.uid) ? (
								<img alt='likes' src={commentFull}></img>
							) : (
								<img alt='likes' src={commentEmpty}></img>
							)}
						</Link>
					</div>
				</footer>
			</article>
		</div>
	);
};
