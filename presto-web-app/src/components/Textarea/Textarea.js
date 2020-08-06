import React, { useState } from 'react';
import styles from './Textarea.module.css';
import SuggestionList from '../SuggestionList/SuggestionList';

export default (props) => {
	return (
		<>
			<div className={styles.div}>
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
			<textarea
				autoComplete='on'
				id={props.label}
				readOnly={props?.readOnly || false}
				className={[
					//general
					styles.textarea,

					//animate up?
					props?.inputs[props.customType]?.animateUp
						? styles.colorTextarea
						: '',

					//error?
					props?.inputs[props.customType]?.message?.error
						? styles.redTextarea
						: '',

					//inactive?
					props?.readOnly ? styles.inactiveTextarea : '',
				].join(' ')}
				value={props?.inputs[props.customType]?.value || ''}
				type={props?.type || 'text'}
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
