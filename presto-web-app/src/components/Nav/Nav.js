import React from 'react';
import styles from './Nav.module.css';
import { Link } from 'react-router-dom';

//images:
import home from '../../assets/images/home.svg';
import posts from '../../assets/images/posts.svg';
import notifications from '../../assets/images/notifications.svg';
import profile from '../../assets/images/profile.svg';
import settings from '../../assets/images/settings.svg';

export default (props) => {
	return (
		<>
			<nav className={styles.nav}>
				<ul className={styles.ul}>
					<li className={styles.li}>
						<Link to='/posts'>
							<button className={styles.button} data-info='Posts'>
								<img className={styles.img} src={posts} alt='posts' />
							</button>
						</Link>
					</li>
					<li className={styles.li}>
						<Link to='/profile'>
							<button className={styles.button} data-info='Profile'>
								<img className={styles.img} src={profile} alt='profile' />
							</button>
						</Link>
					</li>
					<li className={styles.li}>
						<Link to='/settings'>
							<button className={styles.button} data-info='Settings'>
								<img className={styles.img} src={settings} alt='settings' />
							</button>
						</Link>
					</li>
				</ul>
			</nav>
		</>
	);
};
