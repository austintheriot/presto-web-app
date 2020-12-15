export default (
	createdAt: firebase.firestore.Timestamp | string | undefined
) => {
	if (createdAt == undefined) return '';
	else if (typeof createdAt === 'string') {
		let dateArray = new Date(createdAt).toDateString().split(' ');
		return [dateArray[1], dateArray[2] + ',', dateArray[3]].join(' ');
	} else {
		let dateArray = createdAt.toDate().toDateString().split(' ');
		return [dateArray[1], dateArray[2] + ',', dateArray[3]].join(' ');
	}
};
