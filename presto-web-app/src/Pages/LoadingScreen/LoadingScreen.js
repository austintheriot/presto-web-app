import React from 'react';
import styles from './LoadingScreen.module.css'; //local styles

export default () => {
	return (
		<div>
			<img
				src={require('../../assets/images/logo.svg')}
				alt='logo'
				className={styles.Logo}
			/>
			<div className={styles.loadingBar}></div>
		</div>
	);
};
