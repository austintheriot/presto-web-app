export default (doc: firebase.firestore.QueryDocumentSnapshot) => {
	//convert servertimestamps into serialized values for the Redux store:
	let serializedPostCreatedAt = doc.data().createdAt.toDate().toLocaleString();
	//post/comments/{createdAt} --> serlialized value
	let postComments = { ...doc.data().comments };
	//if there are comments on the post:
	if (postComments.count > 0) {
		for (let docIdKey in postComments) {
			//don't iterate using the key 'count'
			if (docIdKey !== 'count') {
				console.log(docIdKey, postComments[docIdKey]);
				postComments[docIdKey].createdAt = postComments[docIdKey].createdAt
					.toDate()
					.toLocaleString();
			}
		}
	}
	let post = {
		id: doc['id'],
		...doc.data(),
		createdAt: serializedPostCreatedAt, //overwrite values with serialized versions
		comments: postComments, //overwrite values with serialized versions
	}; //store doc id from database with the information it contains
	return post;
};
