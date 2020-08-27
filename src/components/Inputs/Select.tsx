import React from 'react';
import styles from './Select.module.scss';
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
			<div className={styles.labelDiv}>
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
			<input
				autoComplete='on'
				id={props?.inputs[props.customType]?.label}
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
				type={props?.type || 'text'}
				onBlur={(e) => props.handleBlur(e, props.customType)}
				onFocus={(e) => props.handleFocus(e, props.customType)}
				onChange={(e) => props.handleChange(e, props.customType)}
			/>
			<SuggestionList
				suggestions={props?.inputs[props.customType]?.suggestions || null}
				suggestionClickHandler={props?.suggestionClickHandler || undefined}
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
