import React from 'react';
import styles from './Message.module.scss';

interface Props {
	color?: string;
	message?: string;
}

const message = (props: Props) => {
	let divStyle;
	switch (props?.color) {
		case 'hidden':
			divStyle = styles.divHidden;
			break;
		case 'black':
			divStyle = styles.divBlack;
			break;
		case 'red':
			divStyle = styles.divRed;
			break;
		case 'green':
			divStyle = styles.divGreen;
			break;
		default:
			divStyle = styles.divHidden;
	}

	let paragraphStyle;
	switch (props?.color) {
		case 'hidden':
			divStyle = styles.paragraphHidden;
			break;
		case 'black':
			paragraphStyle = styles.paragraphBlack;
			break;
		case 'red':
			paragraphStyle = styles.paragraphRed;
			break;
		case 'green':
			paragraphStyle = styles.paragraphGreen;
			break;
		default:
			paragraphStyle = styles.paragraphHidden;
	}

	return (
		<div className={divStyle}>
			<p className={paragraphStyle}>{props.message}</p>
		</div>
	);
};

export default message;
