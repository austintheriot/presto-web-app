import React from 'react';
import styles from './LocationDisplay.module.scss';
import formatLocation from 'app/formatLocation';

import locationIcon from 'assets/images/location.svg';

export function LocationDisplay({
	user,
}: {
	user: {
		city?: string | undefined;
		state?: string | undefined;
		country?: string | undefined;
	};
}) {
	return (
		<div className={styles.locationDiv}>
			<img src={locationIcon} alt='location' />{' '}
			<address>
				{formatLocation({
					city: user.city || '',
					state: user.state || '',
					country: user.country || '',
				})}
				:
			</address>
		</div>
	);
}
