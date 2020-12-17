export default (
	createdAt: firebase.firestore.Timestamp | string | undefined
) => {
	// eslint-disable-next-line eqeqeq
	if (createdAt == undefined) return '';
	const date =
		typeof createdAt === 'string' ? new Date(createdAt) : createdAt.toDate();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const year = date.getFullYear();
	return `${month}/${day}/${year}`;
};
