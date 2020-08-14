import React from 'react';
import styles from './SuggestionList.module.scss';

interface Props {
	suggestions: {
		array: string[];
		loading: boolean;
		show: boolean;
	};
	suggestionClickHandler: Function;
	show: boolean;
	customType: string;
}

export default function SuggestionList({
	suggestions,
	suggestionClickHandler,
	show,
	customType,
}: Props) {
	//if given array, show the array
	//else if loading, show loading,
	//else hide
	let listItems = suggestions?.array ? (
		suggestions.array.map((el, i) => {
			//defer to using element info with indexes before indexes alone
			let key = el ? el.toString() + i : i;
			return (
				<li
					className={styles.li}
					key={key}
					onMouseDown={(e) => suggestionClickHandler(e, i, customType)}>
					{el}
				</li>
			);
		})
	) : suggestions?.loading ? (
		<li className={styles.li}>Loading...</li>
	) : null;

	return (
		<div
			className={[styles.ListContainer, show ? null : styles.hide].join(' ')}>
			<ul className={styles.ul}>{listItems}</ul>
		</div>
	);
}
