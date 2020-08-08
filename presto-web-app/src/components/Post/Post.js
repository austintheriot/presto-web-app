import React from 'react';
import styles from './Post.module.scss';

//images
import heartEmpty from '../../assets/images/heartEmpty.svg';
import heartFull from '../../assets/images/heartFull.svg';
import commentEmpty from '../../assets/images/commentEmpty.svg';
import commentFull from '../../assets/images/commentFull.svg';

export default (props) => {
	return (
		<div className={styles.wrapper}>
			<article className={styles.article}>
				<header>
					<div className={styles.profilePic}></div>
					<h1 className={styles.name}>First Last Very Very Long Name</h1>
					<time dateTime={''}>11:27am, 7/14/2020</time>
					<p className={styles.activity}>Band Leader</p>
				</header>
				<main className={styles.body}>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
						ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
						aliquip ex ea commodo consequat.
					</p>
				</main>
				<footer>
					<p className={styles.likes}>
						<img alt='likes' src={heartFull}></img> 2 likes
					</p>
					<p className={styles.comments}>
						<img alt='likes' src={commentFull}></img> 5 comments
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
