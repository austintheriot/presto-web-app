import React from 'react';
import styles from './Post.module.scss';
import { Link } from 'react-router-dom';
import { TimestampType } from '../../app/config';
import { CommentType } from '../Comment/Comment';

import { useSelector } from 'react-redux';
import { selectUser } from '../../app/userSlice';

//images
import heartEmpty from '../../assets/images/heartEmpty.svg';
import heartFull from '../../assets/images/heartFull.svg';
import commentEmpty from '../../assets/images/commentEmpty.svg';
import commentFull from '../../assets/images/commentFull.svg';

export interface PostType {
	id?: string;
	activity?: string;
	body?: string;
	city?: string;
	comments?: CommentType[];
	country?: string;
	county?: string;
	createdAt?: TimestampType;
	likes?: string[];
	name?: string;
	profilePic?: string;
	state?: string;
	uid?: string;
	zip?: string;
}

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
}: PostType) => {
	const user = useSelector(selectUser);

	return (
		<div className={styles.wrapper}>
			<article className={styles.article}>
				<header>
					{/* PROFILE PIC*/}
					<div className={styles.profilePic}>
						<Link to={`/profile/${uid}`} className={styles.Link}>
							<img alt='/profile' src={profilePic} />
						</Link>
					</div>
					{/* NAME */}
					<Link to={`/profile/${uid}`} className={styles.Link}>
						<h2 className={styles.name}>{name}</h2>
					</Link>
					{/* TIME */}
					<Link
						to={`/post/${id}`}
						className={[styles.Link, styles.timeLink].join(' ')}>
						<time dateTime={createdAt!.toDate().toLocaleString()}>
							{createdAt!.toDate().toLocaleString()}
						</time>
					</Link>
					{/* ACTIVITY */}
					<Link
						to={`/profile/${uid}`}
						className={[styles.Link, styles.activityLink].join(' ')}>
						<p className={styles.activity}>{activity}</p>
					</Link>
				</header>
				{/* BODY */}
				<main className={styles.body}>
					<p>{body}</p>
				</main>
				<footer>
					{/* NUMBER OF LIKES */}
					<Link to={`/post/${id}`} className={styles.Link}>
						<p className={styles.likes}>
							<img alt='likes' src={heartFull}></img> {likes!.length} likes
						</p>
					</Link>
					{/* NUMBER OF COMMENTS */}
					<Link
						to={`/post/${id}`}
						className={[styles.Link, styles.comments].join(' ')}>
						<img alt='likes' src={commentFull}></img> {comments!.length}{' '}
						comments
					</Link>
					<div className={styles.icons}>
						{/* LIKE BUTTON */}
						<button>
							{likes!.includes(user.uid) ? (
								<img alt='likes' src={heartFull}></img>
							) : (
								<img alt='likes' src={heartEmpty}></img>
							)}
						</button>

						{/* COMMENT BUTTON */}
						<Link to={`/post/${id}`} className={styles.Link}>
							<button>
								{comments!.map((el) => el.uid).includes(user.uid) ? (
									<img alt='comments' src={commentFull}></img>
								) : (
									<img alt='comments' src={commentEmpty}></img>
								)}
							</button>
						</Link>
					</div>
				</footer>
			</article>
		</div>
	);
};