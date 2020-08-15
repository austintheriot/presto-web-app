import React from 'react';
import styles from './Textarea.module.scss';
import SuggestionList from '../SuggestionList/SuggestionList';

interface Props {
	inputs: any;
	type: string;
	customType: string;
	readOnly?: boolean;
	handleFocus: Function;
	handleBlur: Function;
	handleChange: Function;
	suggestionClickHandler?: Function;
}

export default (props: Props) => {
	return (
		<>
			<div className={styles.div}>
				<label
					htmlFor={props?.inputs[props.customType]?.label}
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
					{props?.inputs[props.customType]?.label || 'Input'}
				</label>
			</div>
			<textarea
				autoComplete='on'
				id={props?.inputs[props.customType]?.label}
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
				onBlur={(e) => props.handleBlur(e, props.customType)}
				onFocus={(e) => props.handleFocus(e, props.customType)}
				onChange={(e) => props.handleChange(e, props.customType)}
			/>
			<SuggestionList
				suggestions={props?.inputs[props.customType]?.suggestions || null}
				suggestionClickHandler={props?.suggestionClickHandler}
				show={props?.inputs[props.customType]?.suggestions?.show || false}
				customType={props.customType}
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
