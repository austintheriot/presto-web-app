import React from 'react';
import styles from './ProfilePicture.module.scss';

export default function ProfilePicture(props: {
	src: string | undefined;
	size: 'small' | 'small-medium' | 'medium' | 'large';
}) {
	return (
		<img
			src={props.src || 'https://i.postimg.cc/QdjGdXRk/no-img.png'}
			alt='profile'
			className={
				props.size === 'small'
					? styles.small
					: props.size === 'small-medium'
					? styles.smallMedium
					: props.size === 'medium'
					? styles.medium
					: props.size === 'large'
					? styles.large
					: styles.medium
			}
		/>
	);
}
