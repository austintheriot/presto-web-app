import React from 'react';
import styles from './Textarea.module.scss';
import SuggestionList from './SuggestionList/SuggestionList';
import { NewInputType } from 'app/types';

interface Props {
	input: NewInputType;
	customType: string;
	readOnly?: boolean;
	handleFocus?: Function;
	handleBlur?: Function;
	handleChange: Function;
	suggestionClickHandler?: Function;
	setInputs: Function;
}

export default (props: Props) => {
	return (
		<div className={styles.div}>
			{/* Input Element */}
			<textarea
				placeholder=' '
				autoComplete='on'
				spellCheck={true}
				id={props?.input?.label}
				readOnly={props?.readOnly || false}
				className={[
					//general
					styles.input,

					//error?
					props?.input?.message?.error ? styles.redInput : '',

					//inactive?
					props?.readOnly ? styles.inactiveInput : '',
				].join(' ')}
				value={props?.input?.value || ''}
				onBlur={(e) =>
					props.handleBlur ? props.handleBlur(e, props.customType) : null
				}
				onFocus={(e) =>
					props.handleFocus ? props.handleFocus(e, props.customType) : null
				}
				onChange={(e) =>
					props.handleChange ? props.handleChange(e, props.customType) : null
				}
			/>

			{/* Suggestions List */}
			<SuggestionList
				value={props?.input?.value || ''}
				suggestions={props?.input?.suggestions || null}
				suggestionClickHandler={props?.suggestionClickHandler}
				show={props?.input?.suggestions?.show || false}
				customType={props.customType}
				input={props.input}
				setInputs={props.setInputs}
			/>

			{/* Input Label */}
			<label
				htmlFor={props?.input?.label}
				className={[
					//general
					styles.label,

					//error?
					props?.input?.message?.error ? styles.redLabel : '',

					//inactive?
					props?.readOnly ? styles.inactiveLabel : '',
				].join(' ')}>
				{props?.input?.label}
			</label>

			{/* Message */}
			<p
				className={
					props?.input?.message?.error ? styles.redMessage : styles.message
				}>
				{props?.input?.message?.text}
			</p>
		</div>
	);
};
