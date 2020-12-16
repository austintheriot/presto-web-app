import React from 'react';
import styles from './Message.module.scss';

interface Props {
	color?: 'black' | 'red' | 'green' | '';
	message?: string;
}

const message = (props: Props) => {
	let divStyle;
	switch (props.color) {
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
			divStyle = styles.divBlack;
			break;
	}

	let paragraphStyle;
	switch (props.color) {
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
			paragraphStyle = styles.paragraphBlack;
	}

	return (
		<div className={divStyle}>
			<p className={paragraphStyle}>{props.message}</p>
		</div>
	);
};

export default message;
