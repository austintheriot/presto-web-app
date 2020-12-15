import React from 'react';
import styles from './LocationDisplay.module.scss';
import locationFormatter from 'app/locationFormatter';

import locationIcon from 'assets/images/location.svg';
import { UserPayload } from 'app/types';

export function LocationDisplay({ user }: { user: UserPayload }) {
	return (
		<div className={styles.locationDiv}>
			<img src={locationIcon} alt='location' />{' '}
			<address>
				{locationFormatter({
					city: user.city || '',
					state: user.state || '',
					country: user.country || '',
				})}
				:
			</address>
		</div>
	);
}
