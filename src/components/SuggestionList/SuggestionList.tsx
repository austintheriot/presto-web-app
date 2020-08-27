import React from 'react';
import styles from './SuggestionList.module.scss';

interface Props {
	suggestions: {
		array: string[];
		loading: boolean;
		show: boolean;
	};
	suggestionClickHandler?: Function;
	show: boolean;
	customType: string;
	value: string;
}

export default function SuggestionList({
	suggestions,
	suggestionClickHandler,
	show,
	customType,
	value,
}: Props) {
	const searchValue = new RegExp(`${value}`, 'i');
	//if loading, show loading,
	//else if given array, show the array
	//else hide
	let listItems = suggestions?.loading ? (
		<li className={styles.li}>Loading...</li>
	) : suggestions?.array ? (
		suggestions.array
			.filter((el) => el.match(searchValue))
			.map((el, i) => {
				//defer to using element info with indexes before indexes alone
				let key = el ? el.toString() + i : i;
				return (
					<li
						className={styles.li}
						key={key}
						onMouseDown={(e) => {
							if (suggestionClickHandler) {
								suggestionClickHandler(e, i, customType);
							} else {
								return;
							}
						}}>
						{el}
					</li>
				);
			})
	) : null;

	return (
		<div
			className={[styles.ListContainer, show ? null : styles.hide].join(' ')}>
			<ul className={styles.ul}>{listItems}</ul>
		</div>
	);
}
