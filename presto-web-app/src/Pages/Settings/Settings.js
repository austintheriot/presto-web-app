import React from 'react';
import Nav from '../../components/Nav/Nav';
import styles from './Settings.module.scss';
import Button from '../../components/Button/Button';
import logoutFunction from '../../app/logout';

//images
import logout from '../../assets/images/logout.svg';
/* import notifications from '../../assets/images/notifications.svg'; */

export default (props) => {
	return (
		<>
			<Nav />
			<h1 className={styles.title}>Settings</h1>
			<Button>Save</Button>
			{/* LOG OUT */}
			<div className={styles.wrapper}>
				<div className={styles.logoutButtonDiv}>
					<img src={logout} alt='logout' onClick={logoutFunction}></img>
					<p onClick={logoutFunction}>Log Out</p>
				</div>

				{/* NOTIFICATION SETTINGS
				<div className={styles.logoutButtonDiv}>
					<img src={notifications} alt='notifications'></img>
					<p>Notifcations Currently: ON</p>
				</div> */}
			</div>
		</>
	);
};
