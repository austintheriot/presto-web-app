import React from 'react';
import styles from './LoadingScreen.module.css'; //local styles

import logo from '../../assets/images/logo.svg';

export default () => {
	return (
		<div>
			<img src={logo} alt='logo' className={styles.Logo} />
			<div className={styles.loadingBar}></div>
		</div>
	);
};
