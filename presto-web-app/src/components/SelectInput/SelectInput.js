import React, { useState } from 'react';
import styles from './SelectInput.module.css';
import SuggestionList from '../SuggestionList/SuggestionList';

export default (props) => {
	const [state, setState] = useState({
		innerType: 'password',
	});

	const togglePasswordVisibility = () => {
		setState((prevState) => ({
			innerType: prevState.innerType === 'password' ? 'text' : 'password',
		}));
	};

	return (
		<>
			<div className={styles.div}>
				{props?.customType === 'password' ? (
					<img
						className={styles.eye}
						alt='show password'
						src={require('../../assets/images/eye.svg')}
						onClick={togglePasswordVisibility}
					/>
				) : null}
				<label
					htmlFor={props.label}
					className={[
						//general
						styles.label,

						//animate up?
						props?.inputs[props.customType]?.animateUp
							? styles.up
							: styles.down,

						//error?
						props?.inputs[props.customType]?.message?.error
							? styles.redLabel
							: '',

						//inactive?
						props?.readOnly ? styles.inactiveLabel : '',
					].join(' ')}>
					{props?.label || 'Label'}
				</label>
			</div>
			<input
				autoComplete='on'
				id={props.label}
				readOnly={props?.readOnly || false}
				className={[
					//general
					styles.input,

					//animate up?
					props?.inputs[props.customType]?.animateUp ? styles.colorInput : '',

					//error?
					props?.inputs[props.customType]?.message?.error
						? styles.redInput
						: '',

					//inactive?
					props?.readOnly ? styles.inactiveInput : '',
				].join(' ')}
				value={props?.inputs[props.customType]?.value || ''}
				type={
					props?.type === 'password' ? state.innerType : props?.type || 'text'
				}
				onBlur={(e) => props.handleBlur(e, props.customType)}
				onFocus={(e) => props.handleFocus(e, props.customType)}
				onChange={(e) => props.handleChange(e, props.customType)}
			/>
			<SuggestionList
				suggestions={props?.inputs[props.customType]?.suggestions || null}
				suggestionClickHandler={props?.suggestionClickHandler || null}
			/>
			<p
				className={
					props?.inputs[props.customType]?.message?.error
						? styles.redMessage
						: styles.message
				}>
				{props?.inputs[props.customType]?.message?.text}
			</p>
		</>
	);
};
