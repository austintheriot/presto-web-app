export default () => {
	const date = new Date();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const year = date.getFullYear();
	const hours24 = date.getHours();
	const hours12 = hours24 % 12;
	const minutesNumber = date.getMinutes();
	const minutes = //add leading 0 for single-digit numbers
		Math.floor((minutesNumber / 10) % 10) === 0
			? `0${minutesNumber}`
			: minutesNumber;
	const amPM = hours24 > 11 ? 'PM' : 'AM';
	return `${month}/${day}/${year}, ${hours12}:${minutes} ${amPM}`;
};
