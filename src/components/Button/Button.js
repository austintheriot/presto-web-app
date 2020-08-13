import React from 'react';
import styles from './Button.module.scss';

export default ({ ...props }) => {
	let buttonStyle;

	switch (props.customstyle) {
		case 'inverted':
			buttonStyle = styles.inverted;
			break;
		default:
			buttonStyle = styles.Button;
	}

	return (
		<button type='button' className={buttonStyle || styles.Button} {...props}>
			{props.children || 'Button'}
		</button>
	);
};
