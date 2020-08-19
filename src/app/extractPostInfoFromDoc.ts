import { PostType } from './types';

export default (
	doc:
		| firebase.firestore.QueryDocumentSnapshot
		| firebase.firestore.DocumentData
) => {
	//convert servertimestamps into serialized values for the Redux store:
	let serializedPostCreatedAt = '';

	//make sure createdAt is defined before making transformation on it
	if (doc.data()?.createdAt) {
		serializedPostCreatedAt = doc.data().createdAt.toDate().toLocaleString();
	}
	//post/comments/{createdAt} --> serlialized value
	let postComments = { ...doc.data().comments };
	//if there are comments on the post:
	if (postComments.count > 0) {
		for (let docIdKey in postComments) {
			//don't iterate using the key 'count'
			if (docIdKey !== 'count') {
				//make sure createdAt is defined before making transformation on it
				if (postComments[docIdKey].createdAt) {
					postComments[docIdKey].createdAt = postComments[docIdKey].createdAt
						.toDate()
						.toLocaleString();
				}
			}
		}
	}
	let post: PostType = {
		...doc.data(),
		id: doc['id'],
		uid: doc.data()['uid'],
		likes: doc.data()['likes'],
		status: 'success',
		error: '',
		createdAt: serializedPostCreatedAt, //overwrite values with serialized versions
		comments: postComments, //overwrite values with serialized versions
	}; //store doc id from database with the information it contains
	return post;
};
