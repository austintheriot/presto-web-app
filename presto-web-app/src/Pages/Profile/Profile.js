import React from 'react';
import Nav from '../../components/Nav/Nav';
import styles from './Profile.module.css';
import { useAuth } from '../../util/AuthProvider';

export default (props) => {
	const user = useAuth();

	const capitalizeFirstLetter = (string) => {
		return string[0].toUpperCase().concat(string.slice(1));
	};

	return (
		<>
			<Nav />
			<div className={styles.waveDiv}>
				<svg
					className={styles.waveSvg}
					viewBox='0 0 500 150'
					preserveAspectRatio='none'>
					<path
						className={styles.wavePath}
						d='M-1.98,96.22 C113.71,115.95 291.20,128.77 504.22,90.28 L505.35,-5.43 L0.00,0.00 Z'></path>
				</svg>
			</div>
			<div className={styles.wrapper}>
				{/* User Name */}
				<h1 className={styles.title}>{user.name || 'Profile'}</h1>

				{/* Location */}
				<p>
					{(user.city || '') + ', '}
					{(user.state || '') + ', '}
					{user.country || ''}
				</p>

				{/* Type */}
				<p>{user.type ? capitalizeFirstLetter(user.type) : ''}</p>

				{/* Activity */}
				<p>{user.activity || ''}</p>

				{/* Instrument */}
				<p>{user.instrument || ''}</p>

				{/* Website */}
				<p>{user.website || ''}</p>

				{/* Bio */}
				<p>{user.bio || ''}</p>

				{/* Date Joined */}
				{user.createdAt ? (
					<p>
						Joined{' '}
						{new Date(user.createdAt)
							.toDateString()
							.split(' ')
							.slice(1)
							.join(' ')}
					</p>
				) : null}
			</div>
		</>
	);
};
