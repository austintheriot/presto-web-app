import React from 'react';
import { useAuth } from '../../util/AuthProvider';
import styles from './HomePrivate.module.css';
import Nav from '../../components/Nav/Nav';

export default (props) => {
	let { user } = useAuth();

	return (
		<>
			<Nav />
			<h1 className={styles.title}>Home</h1>
		</>
	);
};
